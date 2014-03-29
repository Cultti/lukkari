/****************************************************
 *__________        .__                             *
 *\______   \_____  |__|__  _______  ___.__. ______ *
 * |     ___/\__  \ |  \  \/ /\__  \<   |  |/  ___/ *
 * |    |     / __ \|  |\   /  / __ \\___  |\___ \  *
 * |____|    (____  /__| \_/  (____  / ____/____  > *
 *                \/               \/\/         \/  *
 *                      v1.0						*
 * 			  	  (c)Timo Salola 	                *
 *					  10.4.2012                     *
 *                   Muutokset:						*
 *				v1.1								*
 *				-Linkit muutettu 2. vuoteen			*
 *				-Fonttia kasvatettu					*
 *													*
 *				v1.0								*
 *				-Initial release					*
 ****************************************************/

var d = new Date(); //Määritellään tämä päivä, voit myäs antaa esimerkiksi Date(2012, 1, 2), joka on TO 2.2.2012(Date(YYYY, (M)M-1, (D)D))

//Funktio edellisen maanantain päiväykselle
function prevMond() {
	if(d.getDay() == 0) { //JS palauttaa päiväyksen arvoilla 0-6(0 = sunnuntai)
		var date = d.getDate() - 6;	//Tämä että saadaan oikean viikon maanantai
	}
	else {
		var date = d.getDate() - d.getDay() + 1; //Muuten lasketaan päiväys normaalisti	
	}
	
	return new Date(d.getFullYear(), d.getMonth(), date) //Palautetaan kokonainen päiväys
}

//Funktio seuraavan sunnuntain päiväykselle
function nextSun() {
	if(d.getDay() == 0) { //Onko jo sunnuntai? Ei sitten tarvitse mitään vähentääkkään.
		date = d.getDate();
	}
	else {
		date = 7 - d.getDay() + d.getDate(); //Lasketaan päiväys normaalisti
	}
	
	return new Date(d.getFullYear(), d.getMonth(), date); //Palautetaan kokonainen päiväys
}


//Sijoitetaan linkit paikoilleen.
document.getElementById("ohj").setAttribute("href", "http://ressu.lpt.fi/oklukuj/lukuj2.aspx?pvm1=" + prevMond().getFullYear() + "-" + (prevMond().getMonth() + 1) + "-" + prevMond().getDate() + "&pvm2="+ nextSun().getFullYear() + "-" + (nextSun().getMonth() + 1) + "-" + nextSun().getDate() + "&tunnus=07OHJ11&tyyppi=Ryhma&tpiste=07TL");
document.getElementById("tlt").setAttribute("href", "http://ressu.lpt.fi/oklukuj/lukuj2.aspx?pvm1=" + prevMond().getFullYear() + "-" + (prevMond().getMonth() + 1) + "-" + prevMond().getDate() + "&pvm2="+ nextSun().getFullYear() + "-" + (nextSun().getMonth() + 1) + "-" + nextSun().getDate() + "&tunnus=07TLT11&tyyppi=Ryhma&tpiste=07TL");
document.getElementById("tke").setAttribute("href", "http://ressu.lpt.fi/oklukuj/lukuj2.aspx?pvm1=" + prevMond().getFullYear() + "-" + (prevMond().getMonth() + 1) + "-" + prevMond().getDate() + "&pvm2="+ nextSun().getFullYear() + "-" + (nextSun().getMonth() + 1) + "-" + nextSun().getDate() + "&tunnus=07TKE11&tyyppi=Ryhma&tpiste=07TL");

/**********************************************
Alhaalla oleva funktio myös toimii yhtälailla kuin ylempikin.
Kannattaa tutkia funktion ominaisuuksia ennen kuin
yrittääkorjata" sen virheitä. Tässäapauksessa Date()
osaakin jo ottaa edellisen kuukauden viimeisen päivän,
jos sille antaa atribuutit (YYYY, MM, 0).
***********************************************/

//Nopea funktio tarkastamaan monta päivää kuukaudessa
function daysInMonth(iMonth, iYear) {
	return new Date(iYear, iMonth, 0).getDate(); // 0. päivä= edellisen kuukauden viimeinen
}

function prevMondAlt() {
	
	//Määritellään edellisen maanantain päiväys
	if(d.getDay() == 0) { //JS palauttaa päiväyksen arvoilla 0-6(0 = sunnuntai)
		var date = d.getDate() - 6;	//Tämä että saadaan oikean viikon maanantai
	}
	else {
		var date = d.getDate() - d.getDay() + 1; //Muuten lasketaan päiväys normaalisti	
	}
	
	//Mitä jos date < 1 ??
	if(date < 1) {
		//Jos 1. kuukausi -> edellinen on 12. kuukausi(JS kuukaudet 0-11)
		if(d.getMonth() == 0) {
			date = date + daysInMonth(12, d.getFullYear() - 1); //Haetaan joulukuun viimeinen maanantai
			var prevMond = new Date(d.getFullYear() - 1, 11, date);
		}
		else {
			date = date + daysInMonth(d.getMonth(), d.getFullYear());//Haetaan edellisen kuukauden viimeinen maanantai
			var prevMond = new Date(d.getFullYear(), d.getMonth() - 1, date);
		}
	}
	//Muuten asetetaan päiväys oikein
	else {
		var prevMond = new Date(d.getFullYear(), d.getMonth(), date);
	}
	
	return prevMond;
}