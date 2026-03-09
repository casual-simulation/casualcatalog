const HelpEditor = ({sequence, step, helpArray, updateHelpArray}) => {
    const helpString = helpArray[step - 1] ?? ''

    return (
      <div>
        This is still a work in progress. Please enter valid HTML only, inside a single div.
        <textarea
          name='help'
          className="help-editor"
          type='text'
          value={helpString}
          onChange={updateHelpArray}
          onInput={updateHelpArray}
          required
          id='help-editor'>{helpString}</textarea>
      </div>
    )
}

return HelpEditor