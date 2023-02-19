
const addWhiteSpacesAroundHyphen = (string) => {

  const multipleWhiteSpaces = /\s*-\s*/g
  let formatted
  
  string = string.trim()
	
  if (string.includes('-')) {
    formatted = string.replace(multipleWhiteSpaces, ' - ')  
    return capitalizeFirstLetters(formatted) 
  }
  
  return capitalizeFirstLetters(string)
}

const capitalizeFirstLetters = (string) => {

  if (string.includes(' ')) {
    let words = string.split(' ');
    
    words = [...new Set(words)].filter(Boolean)

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return words.join(' ');
  } else {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}

module.exports = {
  addWhiteSpacesAroundHyphen,
  capitalizeFirstLetters
}