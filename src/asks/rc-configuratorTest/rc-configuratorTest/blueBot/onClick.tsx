const stringInterests = tags.interests ? tags.interests.map((o) => o.label ?? o.value).join(', ') : 'none';
os.toast(`your interests: ${stringInterests}`);