import React, { useEffect, useState } from 'react'

const App = () => {

    const [text, setText] = useState()

    useEffect(() => {
        fetch('/api')
            .then(res => res.text())
            .then(data => setText(data))
    }, [])

    return (
        <div>
            {text}
        </div>
    )

}

export default App
