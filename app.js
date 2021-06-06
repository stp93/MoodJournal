let loadingWrapper = document.querySelector('.loading-wrapper')

window.addEventListener('load', ()=>{
    loadingWrapper.parentElement.removeChild(loadingWrapper)
})
const dark = document.getElementById('dark'),
                body = document.querySelector('body'),
                darkColor = `dark-mode`,
                lightColor = `light-mode`,
                sun = `fa fa-sun`,
                moon = `fa fa-moon`;

// book class represents an entry, object
class Book{
    constructor(title,author,isbn,entry){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.entry = entry
        
    }
}

//UI class handle ui class//////////////////////////////////////////////////////////////////
class UI{
    static displayBooks(){
        // const StoredBooks = [
        //     {
        //         title: 'Entry 1',
        //         author: 'John Smith',
        //         isbn: '33333333'
        //     },
        //     {
        //         title: 'Entry 2',
        //         author: 'Jane Smith',
        //         isbn: '33333323'
        //     }
        // ];
        const books = Store.getBooks();

        books.forEach((book)=>UI.addBookToList(book))
    }
    
    static addBookToList(book){
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            
            <td class="entry-title">${book.title}</td>
            <td class="entry-text">${book.entry}</td>
            <td class="entry-date">${book.isbn}</td>
            <td><a href="#" class="btn delete">X</a></td>
            
        `;
        row.style.backgroundColor = book.author;

        list.appendChild(row);
    }
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    //create alert message to replace JS alert
    //className will be either alert-red or alert-green, do with CSS 
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');
        container.insertBefore(div, form);//insert div created before the form

        //vanish
        setTimeout(()=>document.querySelector('.alert').remove(),1500)
    }
    
    static clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value ='';
        document.getElementById('isbn').value = '';
        document.getElementById('entry').value = '';
    }
}
//dark mode changer ///////////////////////////////////////////////
function darkMode(){
        
        

        if(body.className === `light-mode`){
            dark.className = sun;
            body.className = darkColor;
            localStorage.removeItem('className');
            localStorage.removeItem('icon')
            localStorage.setItem('className', darkColor);
            localStorage.setItem('icon', sun)
            
        }else{
            dark.className = moon;
            body.className = lightColor;
            localStorage.removeItem('bodyClassName');
            localStorage.removeItem('icon')
            localStorage.setItem('className', lightColor);
            localStorage.setItem('icon',moon)
        }
            

            

    }
//store class handles storage local/////////////////////////////////////////////////////////
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books')=== null){
            books = []
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
//event display entries/////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//event add book ///////////////////////////////////////////////////////////////////////////
document.getElementById('book-form',addEventListener('submit',(e)=>{
    //prevent actual submit
    e.preventDefault();
    //get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    const entry = document.getElementById('entry').value;
    //const mood = document.getElementById('mood').value;

    //validate
    if(title == '' || author == '' || isbn == '' || entry == '' ){
        UI.showAlert('Enter something for today','red');
    }else{

    //instantiate book
    const book = new Book(title,author,isbn,entry);
    //console.log(book)

    //addbook to UI
    UI.addBookToList(book);
    //add book to local storage
    Store.addBook(book)
    //show success
    UI.showAlert('Entry Added','success');
    UI.clearFields();
    }

    
    
}))
document.body.className = localStorage.getItem('className'),
dark.className = localStorage.getItem('icon')
//event remove a book in ui and local storage////////////////////////////////////////////////
document.getElementById('book-list').addEventListener('click', (e)=>{
    UI.deleteBook(e.target)

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);//get isbn/date from parent elements siblings text content

    UI.showAlert('Entry Removed','success');
})
