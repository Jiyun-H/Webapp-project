import React, { useState } from 'react';
import axios from 'axios';

// ALSO USELESS, IGNORE!
const UploadImage = () => {
    const [file, setFile] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('http://localhost:5001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="file" onChange={onFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadImage;
