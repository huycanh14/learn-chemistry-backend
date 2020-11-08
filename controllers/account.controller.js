var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var Account = require("../models/account.model.js");
var config = require("../helpers/config.js");
var utils = require("../helpers/utils.js");

const SALT = bcrypt.genSaltSync(12);
var Token_List = {}; // save information for account

const signIn = async (req, res) => {
	/*
	 *step 1: Retrieve information from the client via the body
	 *step 2: select account by email or username. if (data == true) => step 3, else step 4
	 *step 3" check password =>
	 *      if true => create refresh_token and return information to client
	 *      else => return status 401 and message: "Wrong login credential"
	 * step 4: return status 401 and message: "Wrong login credential"
	 */

	let account = req.body; // Step 1
	let data = await Account.findOne(
		{
			$or: [{ email: account.email }, { username: account.username }],
		},
		(err, request) => request,
	); // step 2

	if (data) {
		// step 3
		let check_password = bcrypt.compareSync(account.password, data.password);
		if (check_password) {
			let refresh_token = jwt.sign({ data: data }, config.refreshTokenSecret, {
				expiresIn: config.refreshTokenLife,
			});
			Token_List[refresh_token] = data;
			let response = data;
			response = JSON.parse(JSON.stringify(response));
			delete response.password;
			response.refresh_token = refresh_token;

			return res.json(response);
		} else {
			return res.status(401).json({ message: "Wrong login credential" });
		}
	} else {
		// step 4
		return res.status(401).json({ message: "Wrong login credential" });
	}
};

const createToken = async (req, res) => {
	/**
	 * Step 1: get refresh_token from the client via the headers
	 * Step 2: check refresh_token != null and refresh_token in Token_List
	 *      if true => create access_token. use try catch (return status 403 and message: 'Invalid refresh token')
	 *      else => return status 400 and message: 'Invalid request' and refreshTokenLife: false => time refreshTokenLife end => login again
	 */
	// step 1
	const { refresh_token } = req.headers;
	// step 2
	if (refresh_token && refresh_token in Token_List) {
		try {
			// kiểm tra mã refresh_token
			await utils.verifyJwtToken(refresh_token, config.refreshTokenSecret);
			// lấy lại thông tin account
			const account = Token_List[refresh_token];
			// Tạo mới mã token và trả lại cho user
			let access_token = jwt.sign({ data: account }, config.secret, {
				expiresIn: config.tokenLife,
			});
			let response = account;
			response = JSON.parse(JSON.stringify(response));
			delete response.password;
			response.access_token = access_token;
			return res.status(200).json(response);
		} catch (err) {
			return res.status(403).json({ message: "Invalid refresh token" });
		}
	} else {
		return res
			.status(400)
			.json({ message: "Invalid request", refreshTokenLife: false });
	}
};

const createAccount = async (req, res) => {
	/**
	 * Step 1: get information of new account from the client via the body
	 * Step 2: create new account
	 * >>> if create success => return status(200) and data request
	 * >>> else return status (400) , message: 'Bad request' and error
	 **/
	try {
		let password = bcrypt.hashSync(req.body.password, SALT);
		let account = new Account({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			email: req.body.email,
			date_of_birth: req.body.date_of_birth,
			gender: req.body.gender,
			password: password,
			role_id: req.body.role_id,
			created_at: req.body.created_at,
			updated_at: req.body.updated_at,
			activated: req.body.activated,
		});

		account.save((err, response) => {
			if (err) {
				return res.status(400).json({ message: err });
			} else {
				response = JSON.parse(JSON.stringify(response));
				delete response.password;
				return res.status(200).json({ data: response });
			}
		});
	} catch (err) {
		return res.status(400).json({
			message: "Bad request!",
			error: err.message,
		});
	}
};

const selectAccounts = async (req, res) => {
	/**
	 * if req.query.page
	 * >>> const limit = 10, offset = 0 => offset = (req.query.page - 1) * 10
	 * >>> get key_work = req.query.keyword => select first_name, last_name, username by key_work
	 * >>> get gender
	 * >>> get activated
	 * >>> get role_id
	 * >>> find
	 * else req.query.get_count == 1 => get total count
	 * else return status(400) and message: 'Not query!'
	 */

	try {
		let query = [];
		let keyword = "";
		if (req.query.keyword) keyword = req.query.keyword;
		query = [
			{
				$or: [
					{ first_name: { $regex: keyword, $options: "is" } },
					{ last_name: { $regex: keyword, $options: "is" } },
					{ username: { $regex: keyword, $options: "is" } },
				],
			},
		];

		if (req.query.gender) query.push({ gender: req.query.gender });
		if (req.query.activated) query.push({ activated: req.query.activated });
		if (req.query.role_id) query.push({ role_id: req.query.role_id });
		if (req.query.page) {
			let limit = 10;
			let offset = 0;
			offset = (req.query.page - 1) * 10;

			let sort = {
				created_at: 1,
			};
			if (req.query.sort_created_at === "asc") sort = { created_at: 1 };
			else if (req.query.sort_created_at === "desc") sort = { created_at: -1 };
			else if (req.query.sort_first_name === "asc") sort = { first_name: 1 };
			else if (req.query.sort_first_name === "desc") sort = { first_name: -1 };
			else if (req.query.sort_last_name === "asc") sort = { last_name: 1 };
			else if (req.query.sort_last_name === "desc") sort = { last_name: -1 };
			else if (req.query.sort_username === "asc") sort = { username: 1 };
			else if (req.query.sort_username === "desc") sort = { username: -1 };

			await Account.find(
				{
					$and: query,
				},
				"-password",
				{ limit: limit, skip: offset, sort: sort },
				(err, response) => {
					if (err) res.status(400).json({ message: err });
					else res.status(200).json({ data: response });
				},
			);
		} else if (req.query.get_count == 1) {
			await Account.count({ $and: query }, (err, response) => {
				if (err) {
					return res.status(400).json({ message: err });
				} else {
					return res.status(200).json({ count: response });
				}
			});
		} else return req.status(400).json({ message: "Not query!" });
	} catch (err) {
		return res.status(400).json({
			message: "Bad Request",
			error: err.message,
		});
	}
};

const getAccount = async (req, res) => {
	/**
	 *  get id user from params
	 *  get user by id
	 *
	 */
	try {
		if (req.params.id) {
			let id = req.params.id;
			await Account.findById(id)
				.select("-password")
				.exec((err, response) => {
					if (err) return res.status(400).json({ message: err });
					else return res.status(200).json({ data: response });
				});
		}
	} catch (err) {
		return res
			.status(400)
			.json({ message: "Bad request!", error: err.message });
	}
};

const updateAccount = async (req, res) => {
	/**
	 * get id user from params
	 * if req.body.current_password
	 * >>> find account by id. check password req.body.password, response.password
	 * >>>      if true => set password = bcrypt.hashSync(req.body.password, salt) => findByIdAndUpdate
	 * >>>      else  => return status(400) and message = 'Password is not true'
	 * else findByIdAndUpdate set account = req.body
	 */
	try {
		if (req.params.id) {
			if (req.body.current_password) {
				await Account.findById(req.params.id).exec((err, response) => {
					if (err) return res.status(400).json({ message: err });
					else {
						let check_password = bcrypt.compareSync(
							req.body.password,
							response.password,
						);
						if (check_password) {
							let password = bcrypt.hashSync(req.body.password, SALT);
							Account.findByIdAndUpdate(
								req.params.id,
								{ $set: { password: password } },
								{ new: true },
							)
								.select("-password")
								.exec((err, response) => {
									if (err) return res.status(400).json({ message: err });
									else {
										return res.status(200).json({ data: response });
									}
								});
						} else
							return res.status(400).json({ message: "Password is not true!" });
					}
				});
			} else {
				let account = req.body;
				await Account.findByIdAndUpdate(
					req.params.id,
					{ $set: account },
					{ new: true },
				)
					.select("-password")
					.exec((err, response) => {
						if (err) return res.status(400).json({ message: err });
						else return res.status(200).json({ data: response });
					});
			}
		}
	} catch (err) {
		return res
			.status(400)
			.json({ message: "Bad request!", error: err.message });
	}
};

const deleteAccount = async (req, res) => {
	/**
	 * get id user from params
	 * findByIdAndDelete by id
	 */
	try {
		if (req.params.id) {
			await Account.findByIdAndDelete(req.params.id).exec((err, response) => {
				if (err) return res.status(400).json({ message: err });
				else {
					return res.status(200).json({ message: "Delete successful!" });
				}
			});
		} else return res.status(400).json({ message: "Not query!" });
	} catch (err) {
		return res
			.status(400)
			.json({ message: "Bad request!", error: err.message });
	}
};

const AccountController = {
	signIn,
	createToken,
	createAccount,
	selectAccounts,
	getAccount,
	updateAccount,
	deleteAccount,
};

module.exports = AccountController;
