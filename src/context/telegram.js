import React from "react";

const openShareMenu = () => {

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
    } else {
        console.error('Telegram WebApp API is not available.');
        alert('Unable to open the share menu. Please try again later.');
    }
}

export default openShareMenu;