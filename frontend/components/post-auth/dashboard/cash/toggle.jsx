import React from "react";

const mouseEnterSiblings = e => {
    $(e.currentTarget).siblings().addClass("hovered");
}

const mouseLeaveSiblings = e => {
    $(e.currentTarget).siblings().removeClass("hovered");
}

export default ({type, leftClick, rightClick, leftVal, rightVal, leftClass,
    rightClass, toggleClick, isGrayed}
) => (
    <div className={`${type}-toggle-container`}>
        <button onClick={leftClick} className={leftClass}>{leftVal}</button>

        <span className={`toggle-wrapper`}
            onMouseEnter={mouseEnterSiblings}
            onMouseLeave={mouseLeaveSiblings}
        >
            <label className="switch" id={`${type}-toggle`}>
                <input type="checkbox" onClick={toggleClick}/>
                <span
                    className={`slider ${isGrayed ? `${leftClass}-grayed` : ""}`}
                />
            </label>
        </span>

        {!rightVal ? <></> :
            <button
                onClick={rightClick}
                className={rightClass}
            >{rightVal}</button>
        }
    </div>
)