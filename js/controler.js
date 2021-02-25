function addBook() {
    document.getElementById('searchForm').classList.remove("hidden");
    document.getElementById('newBook').classList.add("hidden");
} 

function cancelSearch() {
    document.getElementById('searchForm').classList.add("hidden");
    document.getElementById('newBook').classList.remove("hidden");
    document.getElementById('title').value="";
    document.getElementById('author').value="";
    document.getElementById('searchResult').innerHTML="";
    
}

function search() {
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var searchLink = "https://www.googleapis.com/books/v1/volumes?q=inauthor:" + author + "+intitle:" + title;
    var result = httpGet(searchLink);
    
    var books = result.items.map(item =>  {
        var volumeInfo = item.volumeInfo;
        var book = {"id" : item.id,
            "title": volumeInfo.title,
            "desc" : volumeInfo.description || 'information manquante' ,
            "author": volumeInfo.authors[0],
            "image": volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'img/unavailable.png'
        };
        return book;   
    });
   
    displayBooks(books); 
}

function displayBooks(books) {
    var div = document.getElementById('searchResult');
    
    for(var i = 0; i<books.length; i++) {
        var book = books[i];
        if (i % 2) {
            div.innerHTML += '<div class="row">'    
        }
        div.innerHTML += bookToHtml(book);
        if (i % 2) {
            div.innerHTML += '</div>'    
        }
    }

    
    books.forEach(book => console.log(book));
}

function bookToHtml(book) {
    return '<div class="col-lg-1"></div>'
    + '<div class="col-lg-4 div-book">'
+ '<h2>Titre: ' + book.title + '</h2>'
+ '<h2>Id: '+ book.id + '</h2>'
+ '<h4>Auteur: ' + book.author + '</h4>'
+ '<p>Description: '+ book.desc + '</p>'
+ '<img src="'+ book.image + '" class="img-responsive img-book" >'
+ '</div>'
    + '<div class="col-lg-1"></div>';
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}