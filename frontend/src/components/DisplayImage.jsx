import React, { useEffect, useState } from 'react';
import axios from 'axios';

// THIS IS MAYBE USELESS, IGNORE THIS CLASS!!!
const DisplayImages = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get('http://localhost:5001/images');
                setImages(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            {images.map((image) => (
                <div key={image._id}>
                    <h3>{image.name}</h3>
                    <img src={`data:${image.img.contentType};base64,${image.imgBase64}`} alt={image.name} />
                </div>
            ))}
        </div>
    );
};

export default DisplayImages;
