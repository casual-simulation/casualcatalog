const Header = () => {
    return (
        <div className="help-header u-clearfix">
            <h3 className="header-title">Help</h3>
            <button className="close-help-btn remove-btn-style" onClick={() => shout('closeHelp')}>
                <i className="material-icons md-36 toggleBtn closeBtn">close</i>
            </button>
        </div>
    )
}

return Header