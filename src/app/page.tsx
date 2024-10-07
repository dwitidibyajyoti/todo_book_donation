"use client";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import React, { useState } from "react";
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: string | number;
  isbn: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const handleNewRecord = () => {
    if (editingBookId) {
      // check if that field has proper field details
      const currentBook = allBooks.find((item) => {
        return item.id === editingBookId;
      });
      if (
        currentBook?.author === "" ||
        currentBook?.genre === "" ||
        currentBook?.isbn === "" ||
        currentBook?.title === "" ||
        currentBook?.year === ""
      ) {
        // console.log("One filed is empty");
        toast.error("Please fill all the field");
        return;
      } else {
        setEditingBookId(null);
      }
    }
    const bookId = nanoid();
    setEditingBookId(bookId);
    setAllBooks((prev) => {
      return [
        {
          id: bookId,
          title: "",
          author: "",
          genre: "",
          year: "",
          isbn: "",
        },
        ...prev,
      ];
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('>>>>>>>>>>>>>>>', e.target);

    const { name, value, id } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const exportToCsv = () => {
    const csvRows = [];

    // Add the headers row (assuming the books have 'title', 'author', 'year', and 'isbn' fields)
    const headers = ["Title", "Author", "Year", "ISBN"];
    csvRows.push(headers.join(","));

    // Loop through each book and format the data as CSV
    allBooks.forEach((book) => {
      const row = [book.title, book.author, book.year, book.isbn];
      csvRows.push(row.join(","));
    });

    // Convert CSV rows to a single string
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books_data.csv"; // Set the download file name
    a.click();
  };

  const handleBookEdit = (
    bookId: string,
    fieldName: string,
    value: unknown
  ) => {
    setAllBooks((prev) => {
      return prev.map((item) => {
        // Check if the current item's id matches the bookId
        if (item.id === bookId) {
          // Return a new object with the updated field
          return {
            ...item,
            [fieldName]: value, // Dynamically update the specified field
          };
        }
        // If it doesn't match, return the item as is
        return item;
      });
    });
  };

  const handleDelete = (bookId: string) => {
    if (editingBookId === bookId) {
      setEditingBookId(null);
    }
    setAllBooks((prev) => {
      // Filter out the book with the matching ID
      return prev.filter((book) => book.id !== bookId);
    });
  };

  const handleSave = (bookId: string) => {
    const currentBook = allBooks.find((item) => {
      return item.id === bookId;
    });
    if (
      currentBook?.author === "" ||
      currentBook?.genre === "" ||
      currentBook?.isbn === "" ||
      currentBook?.title === "" ||
      currentBook?.year === ""
    ) {
      // console.log("One filed is empty");
      toast.error("Please fill all the field");
      return;
    }
    setEditingBookId(null);
  };

  return (
    <div className="p-5">
      <h1 className="uppercase text-center m-5">Donate A Book</h1>

      {/* --- User details ---- */}
      <div className="w-full m-auto">
        <form>
          <div className="w-full flex justify-between flex-wrap space-x-3 items-center mb-3">
            <FormInput
              label="Name"
              type="text"
              // name='name'
              value={formData.name}
              onChange={(e) => handleChange(e)}
            />
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e)}
            />
            <FormInput
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </form>
      </div>

      {/* --- Add Book Button --------- */}
      <div className="m-auto">
        <button
          onClick={handleNewRecord}
          title="button"
          type="button"
          className="flex items-center px-6 py-2 text-center text-white bg-violet-600 border border-violet-600 rounded active:text-violet-500 hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      <div className="mt-3">
        <button
          onClick={exportToCsv}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to CSV
        </button>
      </div>

      {/* ---- Book Table --- */}
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sl. No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year of Publication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allBooks.map((book, index) => (
              <tr
                className={`${editingBookId === book.id && "bg-gray-200"}`}
                key={book.id}
              >
                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                  {editingBookId === book.id ? (
                    <input
                      name="title"
                      onChange={(e) =>
                        handleBookEdit(book.id, "title", e.target.value)
                      }
                      type="text"
                      value={book.title}
                      className="border rounded px-1 py-1 w-full" // Full width input
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                  {editingBookId === book.id ? (
                    <input
                      name="author"
                      onChange={(e) =>
                        handleBookEdit(book.id, "author", e.target.value)
                      }
                      type="text"
                      value={book.author}
                      className="border rounded px-1 py-1 w-full" // Full width input
                    />
                  ) : (
                    book.author
                  )}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                  {editingBookId === book.id ? (
                    <input
                      name="genre"
                      onChange={(e) =>
                        handleBookEdit(book.id, "genre", e.target.value)
                      }
                      type="text"
                      value={book.genre}
                      className="border rounded px-1 py-1 w-full" // Full width input
                    />
                  ) : (
                    book.genre
                  )}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                  {editingBookId === book.id ? (
                    <input
                      name="year"
                      onChange={(e) =>
                        handleBookEdit(book.id, "year", e.target.value)
                      }
                      type="text"
                      value={book.year}
                      className="border rounded px-1 py-1 w-full" // Full width input
                    />
                  ) : (
                    book.year
                  )}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                  {editingBookId === book.id ? (
                    <input
                      name="isbn"
                      onChange={(e) =>
                        handleBookEdit(book.id, "isbn", e.target.value)
                      }
                      type="text"
                      value={book.isbn}
                      className="border rounded px-1 py-1 w-full" // Full width input
                    />
                  ) : (
                    book.isbn
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingBookId === book.id ? (
                    <button
                      type="button"
                      className="text-green-600 hover:text-indigo-900"
                      onClick={() => handleSave(book.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => setEditingBookId(book.id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface FormInputProps {
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex">
      <label htmlFor={label.toLowerCase()} className="mb-1 text-gray-700">
        {label} :
      </label>
      <input
        className="border-b-2 border-gray-300 focus:outline-none focus:border-sky-500 transition-colors duration-300 px-2 py-1"
        type={type}
        id={label.toLowerCase()}
        placeholder={placeholder || ``}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export { FormInput };
