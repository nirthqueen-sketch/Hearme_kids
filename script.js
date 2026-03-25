// New code that handles closing the sidebar properly
function handleSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const isOpen = sidebar.classList.contains('open');

    if (isOpen) {
        sidebar.classList.remove('open');
        sidebar.style.display = 'none';
    } else {
        sidebar.classList.add('open');
        sidebar.style.display = 'block';
    }
}

// Event listener for the sidebar toggle button
const toggleButton = document.getElementById('toggle-button');
toggleButton.addEventListener('click', handleSidebarToggle);
