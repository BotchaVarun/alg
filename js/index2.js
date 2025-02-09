function showSidebar() {
    document.querySelector('.slidebar').style.display = 'flex'; // Show sidebar
    document.querySelector('.overlay').style.display = 'block'; // Show overlay
    document.querySelector('.menu-button').style.display = 'none'; // Hide menu button
    document.body.style.overflow = 'hidden'; // Disable scrolling
}

function hideSidebar() {
    document.querySelector('.slidebar').style.display = 'none'; // Hide sidebar
    document.querySelector('.overlay').style.display = 'none'; // Hide overlay
    document.querySelector('.menu-button').style.display = 'flex'; // Show menu button
    document.body.style.overflow = 'auto'; // Enable scrolling
}
