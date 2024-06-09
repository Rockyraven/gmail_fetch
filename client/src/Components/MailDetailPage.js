import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router
import axios from 'axios';

const MailDetailPage = () => {
  const { id } = useParams(); // Assuming id is passed as a route parameter
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Fetch email details from your backend API
    const fetchEmailDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:6005/readEmail/${id}`);
        setEmail(response.data);
      } catch (error) {
        console.error('Error fetching email details:', error);
      }
    };
    
    fetchEmailDetails();
  }, [id]);

  if (!email) {
    return <div>Loading...</div>; // Basic loading state
  }

  return (
    <div className="container mx-auto py-4">
      <div className="bg-white shadow-md rounded my-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">{email.subject}</h1>
          <div className="flex items-center mb-2">
            <span className="font-semibold mr-2">From:</span>
            <span>{email.from}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="font-semibold mr-2">To:</span>
            <span>{email.to}</span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700">{email.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailDetailPage;
