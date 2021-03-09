function hide(id) {
    document.getElementById(id).classList.add("hidden");
}
function display(id) {
    document.getElementById(id).classList.remove("hidden");
}

function addBook() {
   display("searchForm");
   display("line2");
   hide("line1");
   hide('newBook');

} 

function cancelSearch() {
    hide("searchForm");
    display('newBook');
    display('line1')
    document.getElementById('title').value="";
    document.getElementById('author').value="";
    document.getElementById('searchResult').innerHTML="";
}

function search() {
    document.getElementById('searchResult').innerHTML="";
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    if (!title && !author) {
        displaySearchMessage('veuillez saisir au moins un champs');
        return;
    }
    var searchLink = "https://www.googleapis.com/books/v1/volumes?q=inauthor:" + author + "+intitle:" + title;
    var result = httpGet(searchLink);
    
    var books = [];    
    var items = result.items;
    if (!items) {
        displaySearchMessage("Aucun livre n'a était trouvé");
        return;
    }
    for (var i=0; i<items.length; i++) {
        var item = items[i];
        var volumeInfo = item.volumeInfo;
        var book = {"id" : item.id,
            "title": volumeInfo.title,
            "desc" : volumeInfo.description || 'information manquante' ,
            "author": volumeInfo.authors ? volumeInfo.authors[0] : 'information manquante',
            "image": volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'img/unavailable.png'
        };
        if (book.desc.length > 200) {
            book.shortDesc = book.desc.substring(0,200) + '...';
        }
        if (book.title.length > 50) {
            book.shortTitle = book.title.substring(0,50) + '...';
        }
        
        books.push(book);
        mapBooks[book.id] = book;
    }

    displayBooks(books);
}

var mapBooks = {};

function displayBooks(books) {
    var div = document.getElementById('searchResult');
    displaySearchMessage('Résultats de recherche');
    for(var i = 0; i<books.length; i++) {
        var book = books[i];
        if (i % 2 === 1) {
            div.innerHTML += '<div class="div-empty"></div>';
        }
        div.innerHTML += bookToHtml(book, true);
    }
    
    books.forEach(book => console.log(book));
}

function displaySearchMessage(msg) {
    document.getElementById('searchResult').innerHTML += '<div class="text-center"> <h5>' + msg + '</h5> </div>';
}

function bookToHtml(book, bookFromGoogle) {
    var bookAsHtml =  '<div class="div-book">';
    if (bookFromGoogle) {
        bookAsHtml += '<img src="img/bookmark-solid.svg"  class="bookmark" onclick="bookmark('+ quote(book.id) + ')">';
    } else {
        bookAsHtml += '<img src="img/trash-alt-solid.svg"  class="bookmark" onclick="removeBookmark('+ quote(book.id) + ')">';
    }
    
    bookAsHtml += '<h4>Titre: ' + (book.shortTitle || book.title) + '</h4>'
    + '<h5>Id: '+ book.id + '</h5>'
    + '<h5>Auteur: ' + book.author + '</h5>'
    + '<p>Description: '+ (book.shortDesc || book.desc) + '</p>'
    + '<img src="'+ book.image + '" class="img-responsive img-book" >'
    + '</div>';

    return bookAsHtml;
}

function bookmark(idBook) {
    var book = mapBooks[idBook];
    if (localStorage.getItem(idBook)){
        alert('Vous ne pouvez ajouter deux fois le même livre');
    } else {
        localStorage.setItem(idBook,JSON.stringify(book));
        document.getElementById('poch-list').innerHTML += bookToHtml(book, false);
    }
}

function removeBookmark(idBook) {
    localStorage.removeItem(idBook);
    document.getElementById('poch-list').innerHTML='';
    displaySavedBooks();
}

function displaySavedBooks(){
    for (var i = 0; i < localStorage.length; i++) {
        var id=localStorage.key(i);
        var book = localStorage.getItem(id);
        var div = document.getElementById('poch-list');
        if (i % 2 === 1) {
            div.innerHTML += '<div class="div-empty"></div>';
        }
        div.innerHTML += bookToHtml(JSON.parse(book), false);
    }
}

function quote(string) {
    return "'" + string + "'";
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}
