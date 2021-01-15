import React from "react";
import Toggle from "./toggle";

export default ({isDeposit, setState, expandedOptions}) => {
    const setDeposit = e => {
        e.preventDefault();
        
        if (!isDeposit) $("#cash-deposit-toggle").trigger("click");
    }
    
    const setWithdraw = e => {
        e.preventDefault();
    
        if (isDeposit) $("#cash-deposit-toggle").trigger("click");
    }

    const toggleDeposit = () => setState({isDeposit: !isDeposit});

    const toggleExpandedOptions = e => {
        if ($(e.target).is("button")) e.preventDefault();
        
        setState({expandedOptions: !expandedOptions});
        
        const optionsDiv =  $(".cash-form-options-div");
        optionsDiv.toggleClass("no-height");
        optionsDiv.toggleClass("cash-form-options-div-expanded");
    }

    const clickOptionsToggle = e => {
        e.preventDefault();

        $("#cash-options-toggle").trigger("click");
    }

    return (
        <div className="cash-toggles-container">
            <Toggle
                type="cash-deposit"
                leftClick={setDeposit}
                leftVal="Deposit"
                leftClass={isDeposit ? "dark-green" : "dark-green-hover black"}
                rightClick={setWithdraw}
                rightClass={isDeposit ? "red-hover black" : "red"}
                rightVal="Withdraw"
                toggleClick={toggleDeposit}
            />

            <Toggle
                type="cash-options"
                leftClick={clickOptionsToggle}
                leftVal="Expanded Options"
                leftClass={
                    !expandedOptions ?
                    "dark-green-hover red " :
                    "red-hover dark-green"
                }
                toggleClick={toggleExpandedOptions}
                invertColors={true}
            />
        </div>
    )
}