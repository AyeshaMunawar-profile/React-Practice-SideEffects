import React from "react";
// Context is app-wide state
// to need two things to use context
// 1) Provider (wrap it around components that need it )
// 2) Consume it (You need to hook into it / listen to it )
const AuthContext = React.createContext({
    isLoggedIn: false
})

export default AuthContext;
