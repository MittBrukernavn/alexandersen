const copyToClipboard = (text) => {
  const a = document.createElement('textarea');
  document.body.appendChild(a);
  a.value = text;
  a.select();
  a.setSelectionRange(0, text.length);
  document.execCommand('copy');
  document.body.removeChild(a);
};

export default copyToClipboard;
