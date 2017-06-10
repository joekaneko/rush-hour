;(function(exports) {

var Colors = {
    "B": "black",
    "K": "black",
    "c": "brown",
    "b": "deepskyblue",
    "f": "fuchsia",
    "d": "gold",
    "D": "gold",
    "g": "green",
    "l": "lime",
    "o": "orange",
    "O": "orange",
    "i": "pink",
    "p": "purple",
    "r": "red",
    "R": "red",
    "w": "white",
    "y": "yellow",
    "Y": "yellow",
    }
    
var puz = []

puzZ = [
"  llDr",
"f   Dr",
"fwwdDr",
"   d  ",
"  bdBB",
"  bRRR",
];

puz[0] = [
"      ",
"      ",
"      ",
"      ",
"      ",
"      ",
]

puz[1] = [
"  l   ",
"  lddd",
"  wwf ",
"    f ",
"    b ",
"    b "
]

puz[2] = [
"    d ",
"    d ",
"  wwd ",
"      ",
"  lrrr",
"  l   "
]

puz[3] = [
"     d",
"     d",
"ww   d",
"rllDDD",
"r     ",
"r     "
]

puz[4] = [
"DDD  l",
"  f  l",
"wwf  r",
"  D  r",
"  D  r",
"  D pp"
]

puz[5] = [
"   l d",
"   l d",
"   wwd",
"   f  ",
"   fbb",
"      "
]

puz[6] = [
"     l",
"     l",
"   wwf",
"   d f",
"   dbb",
"   d  "
]

puz[7] = [
"  d   ",
"  d   ",
"wwd  r",
"DDD  r",
"RRR  r",
"    BB"
]

puz[8] = [
"  l   ",
"  l   ",
"wwf   ",
"  f  d",
"  RRRd",
"     d"
]

puz[9] = [
"      ",
"      ",
"   wwd",
"rrr bd",
"  f bd",
"  fDDD"
]

puz[10] = [
"  lldr",
"f   dr",
"fwwDdr",
"   DBB",
"  bD  ",
"  brrr"
]


puz[11] = [
" dddll",
"    ff",
"wwb  B",
"  b  B",
"rrr  p",
"     p"
]

puz[12] = [
"  d l ",
"  d lr",
"  dwwr",
"   D r",
"   Dpp",
"   D  "
]


puz[13] = [
"  D   ",
"  D   ",
"wwD   ",
"     r",
"ddd  r",
"     r"
]

puz[14] = [
" lffD ",
" lbbDB",
"wwr DB",
"  rpp ",
"  r   ",
"      "
]

puz[15] = [
"   B  ",
"   B  ",
"ww f  ",
"   fD ",
" iBBD ",
" i  D "
]

puz[16] = [
" dllr ",
" d  r ",
" dwwr ",
"      ",
"  fddd",
"  f   "
]

puz[17] = [
"     d",
"     d",
"lwwrfd",
"l  rf ",
"b Brpp",
"b Bddd"
];

puz[18] = [
"dddr  ",
"   r  ",
"ww r  ",
" l   d",
" lff d",
"     d",
];

puz[19] = [
"  d  r",
"  d  r",
"  dwwr",
"      ",
"   lff",
"dddl  "
]

puz[20] = [
"DDDl c",
"   l c",
"wwb   ",
"r b   ",
"rdddBB",
"r     "
]

puz[21] = [
"   D  ",
"   D  ",
" wwDr ",
"    r ",
"lfBBr ",
"lfddd "
]

puz[22] = [
" d    ",
" d    ",
" dwwr ",
"DDD r ",
"  l r ",
"fflbb "
]

puz[23] = [
"  l D ",
"  l D ",
"  wwD ",
"  fbb ",
"  fypp",
"rrry  "
]

puz[24] = [
"ddd lf",
"    lf",
"wwb   ",
"B b   ",
"Bpprrr",
"      "
]
 
puz[25] = [
"dddl c",
"  rl c",
"wwr  b",
"  rBBb",
"ddd o ",
" gg o "
]

puz[26] = [
"liibB ",
"l pbBd",
"wwp rd",
"ddd rd",
" gBBr ",
" g    "
]

puz[27] = [
"l pyBB",
"l py  ",
"wwdr p",
"  dr p",
"  dr g",
" BBccg"
] 

puz[28] = [
"  d l ",
"  d lr",
"  dwwr",
" ffD r",
"bB Dpp",
"bB D  "
]

puz[29] = [
"llfd  ",
"  fd  ",
" wwd  ",
"    br",
"Bpggbr",
"Bpdddr"
]

puz[30] = [
"      ",
"      ",
"  wwd ",
"llr d ",
"f r d ",
"f r oo"
]

puz[31] = [
"lffd  ",
"lbbd  ",
"wwBd  ",
"  Bppr",
"ggK cr",
"yyK cr"
]

puz[32] = [
"dddppf",
"  r  f",
"wwrD  ",
"  rDb ",
"KppDbg",
"KBBccg"
]

puz[33] = [
"  l ff",
"  l b ",
" Bwwb ",
" B  pp",
"ddd gK",
"    gK"
]

puz[34] = [
"l  ddd",
"lrrr D",
"wwfb D",
"  fb D",
"   Kgg",
"   K  "
]

puz[35] = [
"l dddf",
"l bB f",
"wwbB p",
" ggK p",
"   Kcc",
"      "
]

puz[36] = [
"yyfd  ",
"r fd  ",
"rwwd  ",
"r  DDD",
"RRR bB",
"pp  bB"
]

puz[37] = [
"dddllf",
"  bBBf",
"wwb rd",
"p  grd",
"pBBgrd",
"  rrr "
]

puz[38] = [
"d  lcc",
"d  l  ",
"dwwb  ",
"rrrb d",
"  Bppd",
"  B  d"
]

puz[39] = [
"ll fdb",
"i  fdb",
"i wwdp",
"   ggp",
"BBc yy",
"  coo "
]

puz[40] = [
"ll  fd",
"bB  fd",
"bB wwd",
"r  p  ",
"rggpBB",
"rccddd"
]

var puza = [
"b Bbbb",
"b Br  ",
"bwwr  ",
"yyoo g",
"     g",
"ppff g"
]

var puzb = [
"ybflBB",
"ybflor",
"y wwor",
"  YYYr",
"  g bb",
"ccg pp"
]

if (exports.puzzles === void 0) exports.puzzles = {};
exports.puzzles = {
    Colors,
    puz,
    puza,
    puzb
};
})(this);