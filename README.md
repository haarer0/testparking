Parking site test example

#1. Installing:
  npm install

#2. Starting
  npm start

#3. Requirement
Система парковки.
-----------
ReactJS(+Redux) + NodeJS (если дойдешь до серверной логики).
У тебя есть n парковочных мест (допустим 30), из них An мест (допустим 10) для грузовых машин (большие парковочные места) и еще Bn мест (допустим 5) для инвалидных машин, остальные стандартные места в которые может заехать инвалидка и обычная машина.
Когда машина заезжает на парковку, у нее есть тип Sedan, Disabled или Truck.
На инвалидных местах могут парковаться только инвалидные машины.
На обычных местах могут парковаться только обычные машины или инвалидные.
На грузовых местах могут парковаться все виды машин, но приоритет инвалидкам и грузовым в первую очередь.
Машина получает парковочное место, которое она резервирует за собой в системе парковки.
Используя вышеупомянутые технологии, опиши систему парковки и машины (как сущностей и отдельные компоненты).
Храни состояние парковки в localStorage изначально.
Реализуй публичный интерфейс для парковки и машины - что бы можно было вызывать методы и проверять работоспособность кода из консоли разработчика.
Важно реализовать метод проверки общего состояния парковки, какие места заняты какими машинами и сколько есть свободных мест.

БОНУС
-----------
Если останется время, попробуй реализовать следующее:
Отрисовать визуально парковку (достаточно квадратов в разных цветах) и отображать их состояние по ходу наполнения машинами.
Под конец очень хотелось бы увидеть создание "рандомайзера", который будет заполнять и разгружать парковкурандомно, выводя статус например в консоль, что бы посмотреть как работает логика.
Серверная часть, например хранение состояния парковки, множество парковок (по разным фиктивным адресам) и их хранение в Redis и работа через какой-нибудь fetch/express JS - это совсем опциональная задача, и вряд ли на нее будет время, но если что - это тоже хороший плюс.


#4. Implementation & usage
Test parking example has been written according to the given requirements (excludin BONUS section) in 5.5hrs (pure)
Curently it can be accessed only via web console.

List of possible commands

window.parking.db.generateInitialData() OR window.dgid() - generates initial data in localStorage
window.parking.db.resetInitialData() OR window.drid() - resets data in localStorage (and reloads the page).
window.parking.db.showSavedData() OR window.dssd() - shows actual information stored in localStorage
window.parking.display.printParkingLayout(parkingId = 0) OR windows.ppl(parkingId = 0) - displays specific parking layout in pseudographics
window.parking.actions.arrive(carType = 's', parkingId = 0) OR windows.arrive( carType = 's', parkingId = 0) - simulates car (with specific carType from ['s', 't', 'd']) arriving to parking. Once a parking place is found by the server, a new carId will be generated and assigned to the car
window.parking.actions.depart(carId, parkingId = 0) OR windows.depart( carId, parkingId = 0) - simulates departing car (by its carId) from the parking