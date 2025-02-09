document.addEventListener("mousemove",parallax);
function parallax(e)
{
    this.querySelectorAll('.layer').forEach(Layer =>
    {
        const speed = Layer.getAttribute('data-speed');
        const x=(window.innerWidth - e.pageX*speed)/100
        const y=(window.innerHeight - e.pageY*speed)/100
        Layer.style.transform = `translateX(${x}px) translateY(${y}px)`
    })
}
function showSidebar() {
    document.querySelector('.sidebar').style.display = 'flex'; // Show sidebar
    document.querySelector('.menu-button').style.display = 'none'; // Show sidebar
    
}

function hideSidebar() {
    document.querySelector('.sidebar').style.display = 'none'; // Hide sidebar
    document.querySelector('.menu-button').style.display = 'flex'; // Show side
}
