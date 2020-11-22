import React from "react";
import {connect} from "react-redux";
import {logout} from "../../actions/session_actions";
import {IoIosGift, IoIosHelpCircle} from "react-icons/io";
import {FaBriefcase} from "react-icons/fa";
import {MdAccountBalance} from "react-icons/md";
import {BsArrowRepeat} from "react-icons/bs";
import {RiHistoryLine, RiMessage2Fill, RiFileTextFill, RiLogoutBoxRLine} from "react-icons/ri";
import {HiDocumentDuplicate} from "react-icons/hi";
import {AiFillSetting} from "react-icons/ai";

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
})

class AccountDropdownItem extends React.Component {

    render() {
        let icon;
        let clickHandler = e => e.preventDefault();
        switch (String(this.props.type)) {
            case "Free Stock":
                icon = <IoIosGift />;
                break;
            case "Account":
                icon = <FaBriefcase />;
                break;
            case "Banking":
                icon = <MdAccountBalance />;
                break;
            case "Recurring":
                icon = <BsArrowRepeat />;
                break;
            case "History":
                icon = <RiHistoryLine />;
                break;
            case "Documents":
                icon = <HiDocumentDuplicate />;
                break;
            case "Settings":
                icon = <AiFillSetting />;
                break;
            case "Help Center":
                icon = <IoIosHelpCircle />;
                break;
            case "Contact Us":
                icon = <RiMessage2Fill />;
                break;
            case "Disclosures":
                icon = <RiFileTextFill />;
                break;
            case "Log Out":
                icon = <RiLogoutBoxRLine />;
                clickHandler = e => {e.preventDefault(); this.props.logout()}
                break;
            default:
                break;
        }
        return (
            <a href="" onClick={clickHandler} className="account-dropdown-item">
                <div className="account-dropdown-item-container">
                    {icon} {this.props.type}
                </div>
            </a>
        )
    }
}

export default connect(null, mapDispatchToProps)(AccountDropdownItem);