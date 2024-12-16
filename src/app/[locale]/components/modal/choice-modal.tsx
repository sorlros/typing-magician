import Choice from "../game-area/item/choice"

const ChoiceModal = () => {
  // sentenceNumber값이 1이 되었을때 캐릭터 직업 선택 modal 띄우기
  // 아이템 혹은 캐릭터 능력 선택하기
  // 캐릭터 & 몬스터 처음 등장시 cpm에 따른 고정된 모션 수정할 것
  return (
    <div className="flex w-full h-full">
      <Choice />
    </div>
  )
}

export default ChoiceModal