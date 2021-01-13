import React from "react";
import HeaderDropdownItem from "./header_dropdown_item";
import {connect} from "react-redux";
import {logout} from "../../../actions/session_actions";
import {IoIosGift, IoIosHelpCircle} from "react-icons/io";
import {FaBriefcase} from "react-icons/fa";
import {MdAccountBalance} from "react-icons/md";
import {BsArrowRepeat} from "react-icons/bs";
import {
    RiHistoryLine,
    RiMessage2Fill,
    RiFileTextFill,
    RiLogoutBoxRLine,
} from "react-icons/ri";
import {HiDocumentDuplicate} from "react-icons/hi";
import {AiFillSetting} from "react-icons/ai";

const NAV_LINE_ITEMS = [
    {
        name: "Free Stock",
        icon: <IoIosGift />,
    },
    {
        name: "Account",
        icon: <FaBriefcase />,
    },
    {
        name: "Banking",
        icon: <MdAccountBalance />,
    },
    {
        name: "Recurring",
        icon: <BsArrowRepeat />,
    },
    {
        name: "History",
        icon: <RiHistoryLine />,
    },
    {
        name: "Documents",
        icon: <HiDocumentDuplicate />,
    },
    {
        name: "Settings",
        icon: <AiFillSetting />,
    },
];

const SUPPORT_LINE_ITEMS = [
    {
        name: "Help Center",
        icon: <IoIosHelpCircle />,
    },
    {
        name: "Contact Us",
        icon: <RiMessage2Fill />,
    },
    {
        name: "Disclosures",
        icon: <RiFileTextFill />,
    },
];

const preventDefault = e => e.preventDefault();

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
});

const HeaderDropdownNav = ({logout}) => (
    <>
        <div className="account-dropdown-container">
            {NAV_LINE_ITEMS.map((item, i) => (
                <HeaderDropdownItem
                    key={i}
                    {...item}
                    onClick={preventDefault}
                />
            ))}
        </div>

        <div className="account-dropdown-container">
            {SUPPORT_LINE_ITEMS.map((item, i) => (
                <HeaderDropdownItem
                    key={i}
                    {...item}
                    onClick={preventDefault}
                />
            ))}
        </div>

        <div className="account-dropdown-container logout">
            <HeaderDropdownItem
                name="Log Out"
                icon={<RiLogoutBoxRLine />}
                onClick={e => {e.preventDefault; logout();}}
            />
        </div>
    </>
);

export default connect(null, mapDispatchToProps)(HeaderDropdownNav);