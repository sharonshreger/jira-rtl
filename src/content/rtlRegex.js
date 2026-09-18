/*
Script		Language

Hebrew		Hebrew, Yiddish
Arabic		Arabic, Persian/Farsi, Urdu, Pashto, Kurdish, Sindhi
Syriac		Aramaic, Assyrian, Chaldean (ancient languages)
Thaana		Dhivehi (Maldives)
Nko			N’Ko (Western African)
Mandaic		Mandaic (Mandaean religion)
Adlam		Fulani (Modern African)
*/

/**
 * REGEX to detect RTL characters, based on unicode scripts which are used in any RTL language
 * 
 * @type {RegExp}
 */
export const RTL_REGEX = /[\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}\p{Script=Mandaic}\p{Script=Adlam}]/u;