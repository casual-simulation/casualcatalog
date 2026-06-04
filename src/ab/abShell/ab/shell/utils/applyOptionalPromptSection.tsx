const { template, name, value } = that;

// Optional sections in a prompt template are wrapped in <<name>> ... <</name>> markers around a
// {{name}} placeholder. When `value` is truthy we drop the markers and fill the placeholder with
// it; when empty/falsy we strip the whole section (header, surrounding copy and all) so it costs
// no tokens. Lets prompts ship optional, user- or context-driven blocks without leaving orphaned
// headers behind. The caller is responsible for normalizing any "unset" sentinel to a falsy value.
const section = new RegExp(`\\n*<<${name}>>\\n([\\s\\S]*?)\\n<</${name}>>`, 'g');

// A replacer *function* is used so $-sequences in the value aren't interpreted.
return template.replace(section, (_match, body) =>
    value ? `\n\n${body.split(`{{${name}}}`).join(value)}` : '');
