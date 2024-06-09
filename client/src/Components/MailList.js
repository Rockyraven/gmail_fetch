import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import axios from 'axios';

const MailListBox = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Fetch emails from your backend API
    const fetchEmails = async () => {
      try {
        const response = await axios.get('http://localhost:6005/listEmails');
        setEmails(response.data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };
    
    fetchEmails();
  }, []);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Mailbox</h1>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="py-3 px-6 text-left">From</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {emails.map(email => (
              <tr key={email.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <Link to={`/mail/${email.id}`} className="text-blue-500 hover:underline">{email.subject}</Link>
                </td>
                <td className="py-3 px-6 text-left">{email.from}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MailListBox;
