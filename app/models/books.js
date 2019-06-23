var mongoose = require('mongoose');


var BooksSchema = new mongoose.Schema({
	book_id: {
		type: Number,
		required: [true, 'Device id field is required']
	},
	book_name: {
		type: String,
		required: [true, 'Field is required']
	}
	
});


const Books = mongoose.model('book', BooksSchema, 'books');
module.exports = Books;

