let DATA = [
  {
    Halqa: "Dooru",
    District: "Anantnag",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Kokernag(ST)",
    District: "Anantnag",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Anantnag West",
    District: "Anantnag",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Anantnag",
    District: "Anantnag",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Srigufwara-Bijbehra",
    District: "Anantnag",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Shangus - Anantnag East",
    District: "Anantnag",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Pahalgam",
    District: "Anantnag",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Sonawari",
    District: "Bandipora",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Bandipora",
    District: "Bandipora",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Gurez�(ST)",
    District: "Bandipora",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Sopore",
    District: "Baramulla",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Rafiabad",
    District: "Baramulla",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Uri",
    District: "Baramulla",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Baramulla",
    District: "Baramulla",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Gulmarg",
    District: "Baramulla",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Wagoora-Kreeri",
    District: "Baramulla",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Pattan",
    District: "Baramulla",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Budgam",
    District: "Budgam",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Beerwah",
    District: "Budgam",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Khan Sahib",
    District: "Budgam",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Chrar-i-Sharief",
    District: "Budgam",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Chadoora",
    District: "Budgam",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Kangan�(ST)",
    District: "Ganderbal",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Ganderbal",
    District: "Ganderbal",
    Constituency: "Srinagar",
  },
  {
    Halqa: "D. H. Pora",
    District: "Kulgam",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Kulgam",
    District: "Kulgam",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Devsar",
    District: "Kulgam",
    Constituency: "Anantnag - Rajouri",
  },
  {
    Halqa: "Karnah",
    District: "Kupwara",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Trehgam",
    District: "Kupwara",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Kupwara",
    District: "Kupwara",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Lolab",
    District: "Kupwara",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Handwara",
    District: "Kupwara",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Langate",
    District: "Kupwara",
    Constituency: "Baramulla",
  },
  {
    Halqa: "Pampore",
    District: "Pulwama",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Tral",
    District: "Pulwama",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Pulwama",
    District: "Pulwama",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Rajpora",
    District: "Pulwama",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Zainapora",
    District: "Shopian",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Shopian",
    District: "Shopian",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Hazratbal",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Khanyar",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Habba Kadal",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Lal Chowk",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Channapora",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Zadibal",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Eidgah",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
  {
    Halqa: "Central Shalteng",
    District: "Srinagar",
    Constituency: "Srinagar",
  },
];

let DISTRICTS = DATA.map((item) => {
  return item["District"].toUpperCase();
});

DISTRICTS = new Set(DISTRICTS);
DISTRICTS = [...DISTRICTS];

let temp = {};

DISTRICTS.forEach((dist) => {
  let d_data = DATA.filter((item) => {
    return item["District"].toUpperCase() === dist;
  });

  console.log(d_data);

  d_data.forEach((item) => {
    if (temp[item["District"]]) {
      if (temp[item["District"]][item["Constituency"]]) {
        temp[item["District"]][item["Constituency"]].push(item["Halqa"]);
      }
    } else {
      temp[item["District"]] = {};
      temp[item["District"]][item["Constituency"]] = [];
      temp[item["District"]][item["Constituency"]].push(item["Halqa"]);
    }
  });
});
