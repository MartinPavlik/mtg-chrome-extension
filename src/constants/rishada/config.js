export const DOMAIN = 'http://www.rishada.cz';

export function getUrl(cardName) {
   return DOMAIN + "/kusovky/vysledky-hledani?searchtype=basic&xxwhichpage=1&xxcardname="+cardName+"&xxedition=1000000&xxpagesize=100&search=Vyhledat"
}
