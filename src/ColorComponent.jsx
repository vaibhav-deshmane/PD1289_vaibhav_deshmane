import React from 'react'

function ColorComponent({ ts, status, value, shouldDisplayTimestamp }) {
    return (
        <>
            <div className="row fw-bold" style={{ letterSpacing: '-3px' }} >
                {status === 1 ? (
                    <p style={{ color: 'green' }}>|</p>
                ) : status === 0 ? (
                    <p style={{ color: 'yellow' }}>|</p>
                ) : (
                    <p style={{ color: 'red' }}>|</p>
                )}
                
            </div>

            {shouldDisplayTimestamp && <div className="timestamp">{new Date(ts).toLocaleTimeString()}</div>}
        </>
    )
}

export default  ColorComponent;
