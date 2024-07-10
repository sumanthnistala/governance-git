// Layout.js

import React from 'react';
import Navbar from "@/app/navigation/page";

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;