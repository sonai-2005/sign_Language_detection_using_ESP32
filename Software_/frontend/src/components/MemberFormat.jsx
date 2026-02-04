import saptarshi from "../member/saptarshi.jpg"
import monu from "../member/coder.jpg"
import sayan from "../member/coder.jpg"
import ranita from "../member/coder.jpg"
import sameer from "../member/coder.jpg"
const membersLi = [
    { name: "Saptarshi", bio: "Here’s your panda. Don’t wake me up.", img:saptarshi },
    { name: "Monu", bio: "topper i.e. (Dube ji ka ladka)", img: monu},
    { name: "Sayan", bio: "ultra talented guy", img: sayan },
    { name: "Ranita", bio: "......", img: ranita },
    { name: "Sameer", bio: "..........", img: sameer }
  ];
export default function MemberF() {
  return (
    <div className="d-flex gap-3 flex-wrap justify-content-center">

      {membersLi.map((m, i) => (
        <div key={i} className="card p-4 bg-dark text-light" style={{ width: "18rem" }}>

          <img
            src={m.img}
            className="rounded-circle w-50 mx-auto d-block mb-3"
            alt={m.name}
          />

          <div className="card-body text-center">
            <h5>{m.name}</h5>
            <p>{m.bio}</p>
            <button className="btn btn-outline-light">Contact</button>
          </div>

        </div>
      ))}

    </div>
  );
}
