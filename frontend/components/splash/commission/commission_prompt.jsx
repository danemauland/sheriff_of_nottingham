import React from "react";

let pText = "Commission-free trading means $0 commission trades placed on self";
pText += "-directed accounts via mobile devices or web. Keep in mind, we may s";
pText +="ell your order to a hedgefund so they can skim a little from the top.";

export default () => (
    <>
        <h2 className="commissions-disclosure-header">
            Commissions Disclosure
        </h2>
        <p className="commissions-disclosure-text">{pText}</p>
    </>
)
