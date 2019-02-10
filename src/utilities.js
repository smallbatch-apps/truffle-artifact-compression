const STRATEGY_KEEP_ALL = 'keep';
const STRATEGY_STRIP_ALL = 'strip';
const STRATEGY_LOAD_AST = 'load';

const cleanArgs = ({input = '', output = '', keep = '', strategy}) => ({ input, output, strategy, keep: keep.split(',').filter(Boolean) });

module.exports = { cleanArgs, STRATEGY_KEEP_ALL, STRATEGY_STRIP_ALL, STRATEGY_LOAD_AST }