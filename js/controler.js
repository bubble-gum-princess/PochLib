function addBook() {
    document.getElementById('searchForm').classList.remove("hidden");
    document.getElementById('newBook').classList.add("hidden");
} 

function cancelSearch() {
    document.getElementById('searchForm').classList.add("hidden");
    document.getElementById('newBook').classList.remove("hidden");
} 