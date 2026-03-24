import React from 'react'
import { useState, useEffect } from 'react'
function Edit() {
    const [data, setdata] = useState([]);
    useEffect(() => {
        fetch(" http://10.130.188.92:5000/data")
            .then(res => res.json())
            .then(data => setdata(data))
            .catch(err => console.log(err));

    }, []);
    return (
        <div>edit<div className="datafetch">
            {data.map((item, index) => (
                <div key={index}>
                    <p>{item.pattern}====={item.message}</p>

                </div>
            ))}

        </div>


        </div>
    )
}

export default Edit