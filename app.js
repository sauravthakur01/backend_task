const express = require('express');
const uuid = require('uuid');
const fs = require('fs');

const app = express();

app.use(express.json());

let authors = [];
let books = [];

let author_id = 1 ;
let book_id = 1 ;


// create author
app.post('/author', (req, res) => {
  const { name } = req.body;
  const existingAuthor = authors.find(a => a.name === name.trim());
  if (existingAuthor) {
    return res.status(400).send({ message: 'Author already exists' });
  }

  const author = {
    id: author_id,
    name: name.trim()
  };

  authors = [...authors, author];

  fs.appendFile(
    'log.txt',
    `User added a new author with id ${author.id} and name ${author.name} at ${new Date()} \n`,
    err => {
      if (err) {
        console.log(err);
      }
    }
  );

  author_id++ ;

  res.status(201).send(author);
});


// create book under author
app.post('/book', (req, res) => {
  const { authorId, bookName } = req.body;
  const author = authors.find(a => a.id === +authorId);
  if (!author) {
    return res.status(400).send({ message: 'Author not found' });
  }

  const existingBook = books.find(b => b.bookName === bookName.trim());
  if (existingBook) {
    return res.status(400).send({ message: 'Book already exists' });
  }

  const book = {
    id: book_id,
    authorId,
    bookName: bookName.trim(),
    ISBN : uuid.v4()
  };

  books = [...books, book];

  fs.appendFile(
    'log.txt',
    `User added a new book with id ${book.id} and name ${book.bookName} at ${new Date()} \n`,
    err => {
      if (err) {
        console.log(err);
      }
    }
  );

  book_id++ ;

  res.status(201).send(book);
});


// get all authors
app.get('/author', (req, res) => {
  fs.appendFile(
    'log.txt',
    `User requested all authors at ${new Date()} \n`,
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.send(authors);
});


// get all books
app.get('/book', (req, res) => {
  fs.appendFile(
    'log.txt',
    `User requested all books at ${new Date()} \n`,
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.send(books);
});


// get author by id
app.get('/author/:id', (req, res) => {
    const author = authors.find(a => a.id === +req.params.id);
    if (!author) {
      return res.status(404).send({ message: 'Author not found' });
    }
  
    fs.appendFile(
      'log.txt',
      `User requested author with id ${author.id} at ${new Date()} \n`,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  
    const authorBooks = books.filter(b => +b.authorId === +author.id);
    res.send({ author, books: authorBooks });
  });
  

//   get book by id
  app.get('/book/:id', (req, res) => {
    const book = books.find(b => b.id === +req.params.id);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }
  
    fs.appendFile(
      'log.txt',
      `User requested book with id ${book.id} at ${new Date()} \n`,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  
    const author = authors.find(a => a.id === book.authorId);
    res.send({ book, author });
  });
  

//   update author name
  app.patch('/author/:id', (req, res) => {
    const author = authors.find(a => a.id === +req.params.id);
    if (!author) {
      return res.status(404).send({ message: 'Author not found' });
    }
  
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: 'Name is required' });
    }
  
    const existingAuthor = authors.find(a => a.name === name.trim());
    if (existingAuthor) {
      return res.status(400).send({ message: 'Author already exists' });
    }
  
    author.name = name.trim();
  
    fs.appendFile(
      'log.txt',
      `User updated author with id ${author.id} and name ${author.name} at ${new Date()} \n`,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  
    res.send(author);
  });


//   update book name
  app.patch('/book/:id', (req, res) => {
    const book = books.find(b => b.id === +req.params.id);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }
  
    const { authorId, bookName, ISBN } = req.body;
    const author = authors.find(a => a.id === authorId);
    if (!author) {
      return res.status(404).send({ message: 'Author not found' });
    }
  
    const existingBook = books.find(b => b.ISBN === ISBN && b.id !== book.id);
    if (existingBook) {
      return res.status(400).send({ message: 'ISBN already exists' });
    }
  
    book.authorId = authorId;
    book.bookName = bookName.trim();
    book.ISBN = ISBN;
  
    fs.appendFile(
      'log.txt',
      `User updated book with id ${book.id} and name ${book.bookName} at ${new Date()} \n`,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  
    res.send({ message: 'Book updated successfully', book });
  });


//   delete author by id
  app.delete('/author/:id', (req, res) => {
    const author = authors.find(a => a.id === +req.params.id);
    if (!author) {
      return res.status(404).send({ message: 'Author not found' });
    }
  
    fs.appendFile(
      'log.txt',
      `User deleted author with id ${author.id} and name ${author.name} at ${new Date()} \n`,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  
    authors = authors.filter(a => a.id !== author.id);
    books = books.filter(b => b.authorId !== author.id);
    res.send({ message: 'Author deleted successfully' });
  });
  

//   delete book by id
  app.delete('/book/:id', (req, res) => {
    const book = books.find(b => b.id === +req.params.id);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }
  
    fs.appendFile(
      'log.txt',
      `User deleted book with id ${book.id} and name ${book.bookName} at ${new Date()} \n`,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  
    books = books.filter(b => b.id !== book.id);
    res.send({ message: 'Book deleted successfully' });
  });
  


  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });