const cleanArgs = ({ input = '', output = '', keep = '', astObject}) => ({
  input,
  output,
  keep: keep.split(',').filter(Boolean),
  astObject
});

module.exports = { cleanArgs }