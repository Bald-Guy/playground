// pages/emoji/emoji.js
const Storage = require('../../utils/storage');
Page({
  data: {
    showPopup: false,
    scrollTop: 0,
    offsetTop: 0,
    container: "scroller",
    groupTitle: "",
    choosedEmojiList: [],
    currentIdex: -1,
    currentTheme: '',
    themeIconUrlList: [
      {
        def: "/images/group/theme/face-icon.png",
        cur: "/images/group/theme/cur-face-icon.png"
      },
      {
        def: "/images/group/theme/bear-icon.png",
        cur: "/images/group/theme/cur-bear-icon.png"
      },
      {
        def: "/images/group/theme/food-icon.png",
        cur: "/images/group/theme/cur-food-icon.png"
      },
      {
        def: "/images/group/theme/ball-icon.png",
        cur: "/images/group/theme/cur-ball-icon.png",
      },
      {
        def: "/images/group/theme/car-icon.png",
        cur: "/images/group/theme/cur-car-icon.png",
      },
      {
        def: "/images/group/theme/light-icon.png",
        cur: "/images/group/theme/cur-light-icon.png",
      },
      {
        def: "/images/group/theme/symbol-icon.png",
        cur: "/images/group/theme/cur-symbol-icon.png",
      },
      {
        def: "/images/group/theme/flag-icon.png",
        cur: "/images/group/theme/cur-flag-icon.png",
      }
    ],
    themeList : [
      // 表情符号与人物
      {
        id: "face",
        title: "表情符号与人物",
        emojiList: [
          '😀','😃','😄','😁','😆','🥹','😅','😂','🤣','🥲','☺️','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😶‍🌫️','😱','😨','😰','😥','😓','🤗','🤔','🫣','🤭','🫢','🫡','🤫','🫠','🤥','😶','🫥','😐','🫤','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😮‍💨','😵','😵‍💫','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🫶','🤲','👐','🙌','👏','🤝','👍','👎','👊','✊','🤛','🤜','🤞','✌️','🫰','🤟','🤘','👌','🤌','🤏','🫳','🫴','👈','👉','👆','👇','☝️','✋','🤚','🖐','🖖','👋','🤙','🫲','🫱','💪','🦾','🖕','✍️','🙏','🫵','🦶','🦵','🦿','💄','💋','👄','🫦','🦷','👅','👂','🦻','👃','👣','👁','👀','🫀','🫁','🧠','🗣','👤','👥','🫂','👶','👧','🧒','👦','👩','🧑','👨','👩‍🦱','🧑‍🦱','👨‍🦱','👩‍🦰','🧑‍🦰','👨‍🦰','👱‍♀️','👱','👱‍♂️','👩‍🦳','🧑‍🦳','👨‍🦳','👩‍🦲','🧑‍🦲','👨‍🦲','🧔‍♀️','🧔','🧔‍♂️','👵','🧓','👴','👲','👳‍♀️','👳','👳‍♂️','🧕','👮‍♀️','👮','👮‍♂️','👷‍♀️','👷','👷‍♂️','💂‍♀️','💂','💂‍♂️','🕵️‍♀️','🕵️','🕵️‍♂️','👩‍⚕️','🧑‍⚕️','👨‍⚕️','👩‍🌾','🧑‍🌾','👨‍🌾','👩‍🍳','🧑‍🍳','👨‍🍳','👩‍🎓','🧑‍🎓','👨‍🎓','👩‍🎤','🧑‍🎤','👨‍🎤','👩‍🏫','🧑‍🏫','👨‍🏫','👩‍🏭','🧑‍🏭','👨‍🏭','👩‍💻','🧑‍💻','👨🏻‍💻','👩‍💼','🧑‍💼','👨‍💼','👩‍🔧','🧑‍🔧','👨‍🔧','👩‍🔬','🧑‍🔬','👨‍🔬','👩‍🎨','🧑‍🎨','👨‍🎨','👩‍🚒','🧑‍🚒','👨‍🚒','👩‍✈️','🧑‍✈️','👨‍✈️','👩‍🚀','🧑‍🚀','👨‍🚀','👩‍⚖️','🧑‍⚖️','👨‍⚖️','👰‍♀️','👰','👰‍♂️','🤵‍♀️','🤵','🤵‍♂️','👸','🫅','🤴','🥷','🦸‍♀️','🦸','🦸‍♂️','🦹‍♀️','🦹','🦹‍♂️','🤶','🧑‍🎄','🎅','🧙‍♀️','🧙','🧙‍♂️','🧝‍♀️','🧝','🧝‍♂️','🧌','🧛‍♀️','🧛','🧛‍♂️','🧟‍♀️','🧟','🧟‍♂️','🧞‍♀️','🧞','🧞‍♂️','🧜‍♀️','🧜','🧜‍♂️','🧚‍♀️','🧚','🧚‍♂️','👼','🤰','🫄','🫃','🤱','👩‍🍼','🧑‍🍼','👨‍🍼','🙇‍♀️','🙇','🙇‍♂️','💁‍♀️','💁','💁‍♂️','🙅‍♀️','🙅','🙅‍♂️','🙆‍♀️','🙆','🙆‍♂️','🙋‍♀️','🙋','🙋‍♂️','🧏‍♀️','🧏','🧏‍♂️','🤦‍♀️','🤦','🤦‍♂️','🤷‍♀️','🤷','🤷‍♂️','🙎‍♀️','🙎','🙎‍♂️','🙍‍♀️','🙍','🙍‍♂️','💇‍♀️','💇','💇‍♂️','💆‍♀️','💆','💆‍♂️','🧖‍♀️','🧖','🧖‍♂️','💅','🤳','💃','🕺','👯‍♀️','👯','👯‍♂️','🕴','👩‍🦽','🧑‍🦽','👨‍🦽','👩‍🦼','🧑‍🦼','👨‍🦼','🚶‍♀️','🚶','🚶‍♂️','👩‍🦯','🧑‍🦯','👨‍🦯','🧎‍♀️','🧎','🧎‍♂️','🏃‍♀️','🏃','🏃‍♂️','🧍‍♀️','🧍','🧍‍♂️','👫','👭','👬','👩‍❤️‍👨','👩‍❤️‍👩','💑','👨‍❤️‍👨','👩‍❤️‍💋‍👨','👩‍❤️‍💋‍👩','💏','👨‍❤️‍💋‍👨','👨‍👩‍👦','👨‍👩‍👧','👨‍👩‍👧‍👦','👨‍👩‍👦‍👦','👨‍👩‍👧‍👧','👩‍👩‍👦','👩‍👩‍👧','👩‍👩‍👧‍👦','👩‍👩‍👦‍👦','👩‍👩‍👧‍👧','👨‍👨‍👦','👨‍👨‍👧','👨‍👨‍👧‍👦','👨‍👨‍👦‍👦','👨‍👨‍👧‍👧','👩‍👦','👩‍👧','👩‍👧‍👦','👩‍👦‍👦','👩‍👧‍👧','👨‍👦','👨‍👧','👨‍👧‍👦','👨‍👦‍👦','👨‍👧‍👧','🪢','🧶','🧵','🪡','🧥','🥼','🦺','👚','👕','👖','🩲','🩳','👔','👗','👙','🩱','👘','🥻','🩴','🥿','👠','👡','👢','👞','👟','🥾','🧦','🧤','🧣','🎩','🧢','👒','🎓','⛑','🪖','👑','💍','👝','👛','👜','💼','🎒','🧳','👓','🕶','🥽','🌂'
        ]
      },
      // 动物与自然
      {
        id:"animal",
        title: "动物与自然",
        emojiList: [
          '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷','🕸','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🦭','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🪶','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿','🦔','🐾','🐉','🐲','🌵','🎄','🌲','🌳','🌴','🪵','🌱','🌿','☘️','🍀','🎍','🪴','🎋','🍃','🍂','🍁','🪺','🪹','🍄','🐚','🪸','🪨','🌾','💐','🌷','🌹','🥀','🪷','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐️','🌟','✨','⚡️','☄️','💥','🔥','🌪','🌈','☀️','🌤','⛅️','🌥','☁️','🌦','🌧','⛈','🌩','🌨','❄️','☃️','⛄️','🌬','💨','💧','💦','🫧','☔️','☂️','🌊','🌫'
        ]
      },
      // 食物与饮料
      {
        id: "food",
        title: "食物与饮料",
        emojiList: [
          '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🫙','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🫘','🍯','🥛','🫗','🍼','🫖','☕️','🍵','🧃','🥤','🧋','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾','🧊','🥄','🍴','🍽','🥣','🥡','🥢','🧂'
        ]
      },
      // 活动
      {
        id: "activity",
        title: "活动",
        emojiList: [
          '⚽️','🏀','🏈','⚾️','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳️','🪁','🛝','🏹','🎣','🛹','🛼','🛷','⛸','🥌','🎿','⛷','🏂','🪂','🏋️‍♀️','🏋️','🏋️‍♂️','🤼‍♀️','🤼','🤼‍♂️','🤸‍♀️','🤸','🤸‍♂️','⛹️‍♀️','⛹️','⛹️‍♂️','🤺','🤾‍♀️','🤾','🤾‍♂️','🏌️‍♀️','🏌️','🏌️‍♂️','🏇','🧘‍♀️','🧘','🧘‍♂️','🏄‍♀️','🏄','🏄‍♂️','🏊‍♀️','🏊','🏊‍♂️','🤽‍♀️','🤽','🤽‍♂️','🚣‍♀️','🚣','🚣‍♂️','🧗‍♀️','🧗','🧗‍♂️','🚵‍♀️','🚵','🚵‍♂️','🚴‍♀️','🚴','🚴‍♂️','🏆','🥇','🥈','🥉','🏅','🎖','🏵','🎗','🎫','🎟','🎪','🤹‍♀️','🤹','🤹‍♂️','🎭','🩰','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🪗','🎸','🪕','🎻','🎲','♟','🎯','🎳','🎮','🎰','🧩'
        ]
      },
      // 旅行与地点
      {
        id: "place",
        title: "旅行与地点",
        emojiList: [
          '🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🦯','🦽','🦼','🩼','🛴','🚲','🛵','🏍','🛺','🛞','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩','💺','🛰','🚀','🛸','🚁','🛶','⛵️','🚤','🛥','🛳','⛴','🚢','🛟','⚓️','🪝','⛽️','🚧','🚦','🚥','🚏','🗺','🗿','🗽','🗼','🏰','🏯','🏟','🎡','🎢','🎠','⛲️','⛱','🏖','🏝','🏜','🌋','⛰','🏔','🗻','🏕','⛺️','🛖','🏠','🏡','🏘','🏚','🏗','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏪','🏫','🏩','💒','🏛','⛪️','🕌','🕍','🛕','🕋','⛩','🛤','🛣','🗾','🎑','🏞','🌅','🌄','🌠','🎇','🎆','🌇','🌆','🏙','🌃','🌌','🌉','🌁'
        ]
      },
      // 物体
      {
        id: "object",
        title: "物体",
        emojiList: [
          '⌚️','📱','📲','💻','⌨️','🖥','🖨','🖱','🖲','🕹','🗜','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽','🎞','📞','☎️','📟','📠','📺','📻','🎙','🎚','🎛','🧭','⏱','⏲','⏰','🕰','⌛️','⏳','📡','🔋','🪫','🔌','💡','🔦','🕯','🪔','🧯','🛢','💸','💵','💴','💶','💷','🪙','💰','💳','🪪','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒','🛠','⛏','🪚','🔩','⚙️','🪤','🧱','⛓','🧲','🔫','💣','🧨','🪓','🔪','🗡','⚔️','🛡','🚬','⚰️','🪦','⚱️','🏺','🔮','📿','🧿','🪬','💈','⚗️','🔭','🔬','🕳','🩻','🩹','🩺','💊','💉','🩸','🧬','🦠','🧫','🧪','🌡','🧹','🪠','🧺','🧻','🚽','🚰','🚿','🛁','🛀','🧼','🪥','🪒','🧽','🪣','🧴','🛎','🔑','🗝','🚪','🪑','🛋','🛏','🛌','🧸','🪆','🖼','🪞','🪟','🛍','🛒','🎁','🎈','🎏','🎀','🪄','🪅','🎊','🎉','🎎','🏮','🎐','🪩','🧧','✉️','📩','📨','📧','💌','📥','📤','📦','🏷','🪧','📪','📫','📬','📭','📮','📯','📜','📃','📄','📑','🧾','📊','📈','📉','🗒','🗓','📆','📅','🗑','📇','🗃','🗳','🗄','📋','📁','📂','🗂','🗞','📰','📓','📔','📒','📕','📗','📘','📙','📚','📖','🔖','🧷','🔗','📎','🖇','📐','📏','🧮','📌','📍','✂️','🖊','🖋','✒️','🖌','🖍','📝','✏️','🔍','🔎','🔏','🔐','🔒','🔓'
        ]
      },
      // 符号
      {
        id: "symbol",
        title: "符号",
        emojiList: [
          '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈️','♉️','♊️','♋️','♌️','♍️','♎️','♏️','♐️','♑️','♒️','♓️','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚️','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕️','🛑','⛔️','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗️','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯️','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿️','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','⏏️','▶️','⏸','⏯','⏹','⏺','⏭','⏮','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','🟰','♾️','💲','💱','™️','©️','®️','👁‍🗨','🔚','🔙','🔛','🔝','🔜','〰️','➰','➿','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫️','⚪️','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾️','◽️','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛️','⬜️','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','💬','💭','🗯','♠️','♣️','♥️','♦️','🃏','🎴','🀄️','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧'
        ]
      },
      // 旗帜
      {
        id: "flag",
        title: "旗帜",
        emojiList: [
          '🏳️','🏴','🏴‍☠️','🏁','🚩','🏳️‍🌈','🏳️‍⚧️','🇺🇳','🇦🇱','🇩🇿','🇦🇫','🇦🇷','🇦🇪','🇦🇼','🇴🇲','🇦🇿','🇪🇬','🇪🇹','🇮🇪','🇪🇪','🇦🇩','🇦🇴','🇦🇮','🇦🇬','🇦🇹','🇦🇽','🇦🇺','🇲🇴','🇧🇧','🇵🇬','🇧🇸','🇵🇰','🇵🇾','🇵🇸','🇧🇭','🇵🇦','🇧🇷','🇧🇾','🇧🇲','🇧🇬','🇲🇵','🇲','🇰','🇧🇯','🇧🇪','🇵🇪','🇮🇸','🇵🇷','🇵🇱','🇧🇦','🇧🇴','🇧🇿','🇧🇼',,'🇧🇹','🇧🇫','🇧🇮','🇮🇴','🇰🇵','🇬🇶','🇩🇰','🇩🇪','🇹🇱','🇹🇬','🇩🇴','🇩🇲','🇷🇺','🇪🇨','🇪🇷','🇫🇷','🇫🇴','🇵🇫','🇬🇫','🇹🇫','🇻🇦','🇵🇭','🇫🇯','🇫🇮','🇨','🇻','🇫🇰','🇬🇲','🇨🇬','🇨🇩','🇨🇴','🇨🇷','🇬🇩','🇬🇱','🇬🇪','🇬🇬','🇨🇺','🇬🇵','🇬🇺','🇬🇾','🇰🇿','🇭🇹','🇰🇷','🇳🇱','🇧🇶','🇸🇽','🇲🇪','🇭🇳','🇰🇮','🇩🇯','🇰🇬','🇬🇳','🇬🇼','🇨🇦','🇬🇭','🇮🇨','🇬🇦','🇰🇭','🇨🇿','🇿🇼','🇨🇲','🇶🇦','🇰🇾','🇨🇨','🇰🇲','🇽🇰','🇨🇮','🇰🇼','🇭🇷','🇰🇪','🇨🇰','🇨🇼','🇱🇻','🇱🇸','🇱🇦','🇱🇧','🇱🇹','🇱🇷','🇱🇾','🇱🇮','🇷🇪','🇱🇺','🇷🇼','🇷🇴','🇲🇬','🇮🇲','🇲🇻','🇲🇹','🇲🇼','🇲🇾','🇲🇱','🇲🇭','🇲🇶','🇾🇹','🇲🇺','🇲🇷','🇺🇸','🇦🇸','🇻🇮','🇲🇳','🇲🇸','🇧🇩','🇫🇲','🇲🇲','🇲🇩','🇲🇦','🇲🇨','🇲🇿','🇲🇽','🇳🇦','🇿🇦','🇦🇶','🇬🇸','🇸🇸','🇳🇷','🇳🇮','🇳🇵','🇳🇪','🇳🇬','🇳🇺','🇳🇴','🇳🇫','🇪🇺','🇵🇼','🇵🇳','🇵🇹','🇯🇵','🎌','🇸🇪','🇨🇭','🇸🇻','🇼🇸','🇷🇸','🇸🇱','🇸🇳','🇨🇾','🇸🇦','🇧🇱','🇨🇽','🇸🇹','🇸🇭','🇰🇳','🇱🇨','🇸🇲','🇵🇲','🇻🇨','🇱🇰','🇸🇰','🇸🇮','🇸🇿','🇸🇩','🇸🇷','🇸🇧','🇸🇴','🇹🇯','🇹🇭','🇹🇿','🇹🇴','🇹🇨','🇹🇹','🇹🇳','🇹🇻','🇹🇷','🇹🇲','🇹🇰','🇼🇫','🇻🇺','🇬🇹','🇻🇪','🇧🇳','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇪🇸','🇪🇭','🇬🇷','🇭🇰','🇸🇬','🇳🇨','🇳🇿','🇭🇺','🇸🇾','🇯🇲','🇦🇲','🇾🇪','🇮🇶','🇮🇷','🇮🇱','🇮🇹','🇮🇳','🇮🇩','🇬🇧','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🏴󠁧󠁢󠁳󠁣󠁴󠁿','🏴󠁧󠁢󠁷󠁬󠁳󠁿','🇻🇬','🇯🇴','🇻🇳','🇿🇲','🇯🇪','🇹🇩','🇬🇮','🇨🇱','🇨🇫','🇨🇳'
        ]
      }
    ],
  },
  onLoad(options) {
    console.log(options);
    let _this = this;
    switch (options.scene) {
      case "1":
        console.log("添加新的表情分组");
        _this.setData({ scene: 1 });
        break;
      case "2":
        console.log("编辑旧的表情分组");
        let group_str = decodeURIComponent(options.group);
        let group = JSON.parse(group_str);
        _this.setData({
          scene: 2,
          groupIdx: parseInt(options.index),
          groupTitle: group.title,
          choosedEmojiList: group.list,
          currentIdex: group.list.length - 1
        });
        break;
    }
    this.getElemParm();
  },
  groupTitleInput(e) {
    console.log("表情分组名称：", e);
  },
  groupTitleInputBlur(e) {
    this.setData({ groupTitle: e.detail.value });
  },
  openPopup() {
    this.setData({ showPopup: true });
  },
  closePopup() {
    this.setData({ showPopup: false });
  },
  onClosePopup() {
    console.log("保存数据");
  },
  scrollToTheme(e) {
    console.log(e);
    let _this = this;
    let index = e.currentTarget.dataset.themeidx;
    switch(index) {
      case 0:
        _this.setData({ curThemeIdx: 0, currentTheme: "face" });
        break;
      case 1:
        _this.setData({ curThemeIdx: 1, currentTheme: "animal" });
        break;
      case 2:
        _this.setData({ curThemeIdx: 2, currentTheme: "food" });
        break;
      case 3:
        _this.setData({ curThemeIdx: 3, currentTheme: "activity" });
        break;
      case 4:
        _this.setData({ curThemeIdx: 4, currentTheme: "place" });
        break;
      case 5:
        _this.setData({ curThemeIdx: 5, currentTheme: "object" });
        break;
      case 6:
        _this.setData({ curThemeIdx: 6, currentTheme: "symbol" });
        break;
      case 7:
        _this.setData({ curThemeIdx: 7, currentTheme: "flag" });
        break;
    } 
  },
  onScroll(event) {
    console.log(event);
    wx.createSelectorQuery()
      .select('#scroller')
      .boundingClientRect((res) => {
        this.setData({
          scrollTop: event.detail.scrollTop,
          offsetTop: res.top,
        });
      })
      .exec();
  },
  emojiInput(e) {
    let ls = this.data.choosedEmojiList;
    let idx = this.data.currentIdex;
    let emoji = e.currentTarget.dataset.emoji;
    ls.splice(idx+1, 0, emoji);
    idx += 1;
    this.setData({ 
      choosedEmojiList: ls,
      currentIdex: idx
    });
  },
  emojiDelete(e) {
    let ls = this.data.choosedEmojiList;
    let idx = this.data.currentIdex;
    ls.splice(idx, 1);
    idx -= 1;
    this.setData({ 
      choosedEmojiList: ls,
      currentIdex: idx
    });
  },
  moveLeft() {
    let idx = this.data.currentIdex;
    if(idx != -1) {
      idx -= 1;
      this.setData({ currentIdex: idx });
    }
  },
  moveRight() {
    let idx = this.data.currentIdex;
    let len = this.data.choosedEmojiList.length - 1;
    if(idx != len) {
      idx += 1;
      this.setData({ currentIdex: idx });
    }
  },
  saveGroup() {
    let _this = this;
    let scene = _this.data.scene;
    let group = {
      title: _this.data.groupTitle,
      list: _this.data.choosedEmojiList
    };
    switch (scene) {
      case 1: // 添加新分组
        if(group.title != '' && group.list.length != 0) {
          Storage.setGroupList(group);
        }
        break;
      case 2: // 编辑旧分组
        let index = _this.data.groupIdx;
        Storage.getGroupList().then((grouplist)=>{
          grouplist.splice(index, 1, group);
          Storage.setStorage('grouplist', grouplist);
        });
        break;
    }

  },
  getElemParm() {
    wx.createSelectorQuery().select('#scroller')
      .boundingClientRect((res) => {
        this.setData({

          offsetTop: res.top,
        });
      })
      .exec();
  },
  onUnload() {
    console.log("退出页面");
    this.saveGroup();
  }
})