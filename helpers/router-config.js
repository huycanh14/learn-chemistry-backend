const router_config = {
    url: "http://127.0.0.1:3000",
    api : "/api/v1",
    page: "/page",
    account: {
        url: "/account",
        logopt_endpoint: "/logopt",
        token_endpoint: "/token",
        create_account: "/create",
        page: "/page",
        select_account: "/get",
        change: "/profile"
    },
    grade_level: {
        url: "/grade_level",
    },
    chapter:{
        url: "/chapter",
    },
    lesson:{
        url: "/lesson"
    },
    theory: {
        url: "/theory"
    }
    // logopt_endpoint: "api/v1/account/logopt"
}

module.exports = router_config;