async function loadPerfume() {

    const response = await fetch("../data/perfumes.json");

    const perfumes = await response.json();

    const perfume = perfumes[0];


    document.getElementById("name").innerHTML = perfume.name;

    document.getElementById("image").src = "../" + perfume.image;

    document.getElementById("description").innerHTML =
        perfume.description;


    document.getElementById("notes").innerHTML =
        perfume.notes.join(", ");


    document.getElementById("longevity").innerHTML =
        perfume.longevity;


    let sizeHTML = "";

    perfume.sizes.forEach(size => {

        sizeHTML += `
        <button class="size-btn"
        onclick="order('${size.ml}','${size.price}')">

        ${size.ml} - ৳${size.price}

        </button>
        `;

    });


    document.getElementById("sizes").innerHTML = sizeHTML;



    window.order = function(size, price){

        let message =
`Hello Scentory,

I want to order:

${perfume.name}

Size:
${size}

Price:
৳${price}`;


        window.open(
        "https://wa.me/8801410939978?text=" 
        + encodeURIComponent(message)
        );

    };

}


loadPerfume();
