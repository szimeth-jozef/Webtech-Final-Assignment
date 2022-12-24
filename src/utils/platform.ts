export function isMobileBrowser() {
    const agent = navigator.userAgent
    const isWebkit = (agent.indexOf("AppleWebKit") > 0)
    const isIPad = (agent.indexOf("iPad") > 0)
    const isIOS = (agent.indexOf("iPhone") > 0 || agent.indexOf("iPod") > 0)
    const isAndroid = (agent.indexOf("Android")  > 0)
    const isNewBlackBerry = (agent.indexOf("AppleWebKit") > 0 && agent.indexOf("BlackBerry") > 0)
    const isWebOS = (agent.indexOf("webOS") > 0)
    const isWindowsMobile = (agent.indexOf("IEMobile") > 0)
    const isSmallScreen = (screen.width < 767 || (isAndroid && screen.width < 1000))
    const isUnknownMobile = (isWebkit && isSmallScreen)
    const isMobile = (isIOS || isAndroid || isNewBlackBerry || isWebOS || isWindowsMobile || isUnknownMobile)
    const isTablet = (isIPad || (isMobile && !isSmallScreen))

    return isMobile && isSmallScreen && document.cookie.indexOf( "mobileFullSiteClicked=") < 0
}