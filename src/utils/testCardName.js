

export function splitIntoNameAndStatus(line) {
  const tokens = line.split(' - ');
  if(tokens.length == 2) {
    return {
      name: tokens[0],
      status: tokens[2]
    }
  } else {
    return {
      name: line,
      status: undefined
    }
  }
}

export default function testCardName(cardName, line) {
  const startIndex = line.indexOf(cardName)
  if(startIndex == -1) {
    return false;
  }
  
  // any prefix? let's check it
  if(startIndex > 0) {
    const prefix = line.substr(0, startIndex);
    console.info(prefix, prefix.trim().length)
    if(prefix.trim().length != 0) {
      console.log('not matching previous')
      return false;
    }
  }
  
  const endIndex = startIndex + cardName.length;
  if(endIndex < line.length) {
    const postfix = line.substr(endIndex, line.length)
    console.info(`postfix:  '${postfix}'`)
    if(postfix.trim().length != 0) {
      // check if the postifx constains version
      const match = postfix.match(/[\s]*\(.*\)[\s]*/)
      if(match && match[0] == postfix) {
        return true;
      }
      return false;
    }
  }
  return true;
}