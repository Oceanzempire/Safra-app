export interface EmergencyGuide {
  id: string;
  title: string;
  category:
    | 'medical'
    | 'natural'
    | 'home'
    | 'travel'
    | 'technology'
    | 'security';
  description: string;
  steps: string[];
  additionalInfo?: string;
  icon?: string;
  color?: string;
}

export const emergencyGuides: EmergencyGuide[] = [
  {
    id: 'cpr',
    title: 'CPR',
    category: 'medical',
    description:
      "Cardiopulmonary resuscitation (CPR) is a lifesaving technique that is useful in many emergencies, such as a heart attack or near drowning, in which someone's breathing or heartbeat has stopped.",
    steps: [
      'Check the scene for safety and the person for responsiveness.',
      'If the person is unresponsive, call 911 or ask someone else to do so.',
      'Place the person on their back on a firm, flat surface.',
      "Kneel beside the person's neck and shoulders.",
      "Place the heel of one hand over the center of the person's chest, between the nipples.",
      'Place your other hand on top of the first hand. Keep your elbows straight and position your shoulders directly above your hands.',
      'Use your body weight to push straight down on the chest at least 2 inches but not more than 2.4 inches. Push hard at a rate of 100 to 120 compressions a minute.',
      'If you have not been trained in CPR, continue chest compressions until help arrives.',
      'If you have been trained in CPR, go on to opening the airway and rescue breathing.',
    ],
    additionalInfo:
      'Remember, even if you are not trained, you can still perform hands-only CPR by pushing hard and fast in the center of the chest.',
    icon: 'heart',
    color: '#F44336',
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety',
    category: 'home',
    description:
      'Fire safety is the set of practices intended to reduce the destruction caused by fire. Fire safety measures include those that are intended to prevent ignition of an uncontrolled fire, and those that are used to limit the development and effects of a fire after it starts.',
    steps: [
      'If you detect a fire, alert everyone in the building by yelling "Fire!" and activate the fire alarm if available.',
      'Call emergency services (911) immediately.',
      'If the fire is small and contained, use a fire extinguisher if you know how to use one safely.',
      'If the fire is large or spreading, evacuate immediately. Do not try to fight it.',
      'Stay low to the ground to avoid smoke inhalation as you evacuate.',
      'Feel doors before opening them. If a door is hot, do not open it. Find another exit route.',
      'Close doors behind you as you leave to slow the spread of fire.',
      'Never use elevators during a fire. Use stairs instead.',
      'Once outside, go to your designated meeting spot and do a head count.',
      'Never re-enter a burning building for any reason. Wait for firefighters to arrive.',
    ],
    additionalInfo:
      'Remember the acronym RACE: Rescue, Alarm, Contain, Extinguish/Evacuate.',
    icon: 'flame',
    color: '#FF9800',
  },
  {
    id: 'tornado',
    title: 'Tornado',
    category: 'natural',
    description:
      'Tornadoes are violent rotating columns of air that extend from a thunderstorm to the ground. They can cause fatalities and devastate a neighborhood in seconds. Winds of a tornado may reach 300 miles per hour.',
    steps: [
      'If you are under a tornado warning, find shelter immediately.',
      'Go to a basement, storm cellar, or an interior room on the lowest floor with no windows.',
      'In a high-rise building, go to a small interior room or hallway on the lowest floor possible.',
      'Stay away from windows, doors, and outside walls.',
      'Do not try to outrun a tornado in a vehicle. Instead, leave the vehicle immediately and seek shelter.',
      'If you are outside with no shelter, lie flat in a nearby ditch or depression and cover your head with your hands.',
      'Watch out for flying debris. Flying debris from tornadoes causes most fatalities and injuries.',
      'Use your arms to protect your head and neck.',
      'Listen to local news or a NOAA Weather Radio for updates and instructions.',
      'After a tornado, stay away from damaged areas and watch out for fallen power lines.',
    ],
    additionalInfo:
      'Know the signs of a tornado: a dark, often greenish sky; large hail; a large, dark, low-lying cloud; and a loud roar, like a freight train.',
    icon: 'wind',
    color: '#2196F3',
  },
  {
    id: 'hypothermia',
    title: 'Hypothermia',
    category: 'medical',
    description:
      'Hypothermia is a medical emergency that occurs when your body loses heat faster than it can produce heat, causing a dangerously low body temperature. Normal body temperature is around 98.6°F (37°C). Hypothermia occurs as your body temperature falls below 95°F (35°C).',
    steps: [
      'Call 911 if you suspect someone has hypothermia.',
      'Move the person out of the cold, if possible. If you cannot move the person, shield them from the cold and wind.',
      'Remove wet clothing and replace with warm, dry coats or blankets.',
      'If the person is conscious, offer warm, sweet, non-alcoholic drinks.',
      'Do not apply direct heat such as hot water, a heating pad, or a heating lamp to warm the person.',
      'Do not massage or rub the person. Handle them gently.',
      'If the person is unconscious, monitor their breathing and pulse. Begin CPR if necessary.',
      'Share body heat by lying next to the person. Direct skin-to-skin contact is best.',
      'Cover both bodies with blankets.',
      'Continue monitoring the person until emergency help arrives.',
    ],
    additionalInfo:
      'Signs of hypothermia include shivering, slurred speech, slow breathing, confusion, drowsiness, and loss of coordination.',
    icon: 'thermometer-snowflake',
    color: '#03A9F4',
  },
  {
    id: 'heat-stroke',
    title: 'Heat Stroke',
    category: 'medical',
    description:
      'Heat stroke is a condition caused by your body overheating, usually as a result of prolonged exposure to or physical exertion in high temperatures. This most serious form of heat injury, heat stroke, can occur if your body temperature rises to 104°F (40°C) or higher.',
    steps: [
      'Call 911 immediately if you suspect someone has heat stroke.',
      'Move the person to a cool, shaded area.',
      'Remove excess clothing.',
      'Cool the person rapidly using whatever methods you can: Place in a cool bath, spray with cool water from a garden hose, sponge with cool water.',
      'Apply ice packs to the armpits, groin, neck, and back. These areas are rich with blood vessels close to the skin, and cooling them may reduce body temperature.',
      'Fan air over the person while wetting their skin with water.',
      'If the person is conscious and able to swallow, give cool water or other nonalcoholic, non-caffeinated beverages.',
      'Monitor body temperature and continue cooling efforts until the body temperature drops to 101-102°F (38.3-38.9°C).',
      'If emergency response is delayed, call the hospital emergency room for additional instructions.',
      'If the person is unconscious or has seizures, lay them on their side to prevent choking.',
    ],
    additionalInfo:
      'Signs of heat stroke include high body temperature, altered mental state, alteration in sweating, nausea and vomiting, flushed skin, rapid breathing, racing heart rate, and headache.',
    icon: 'thermometer-sun',
    color: '#FF5722',
  },
  {
    id: 'allergic-reaction',
    title: 'Allergic Reaction',
    category: 'medical',
    description:
      'An allergic reaction is the way your body responds to the allergen, a substance that your body views as a harmful "invader." Allergic reactions can range from mild to severe and life-threatening (anaphylaxis).',
    steps: [
      'For severe allergic reactions (anaphylaxis), call 911 immediately.',
      'If the person has an epinephrine auto-injector (EpiPen), help them use it immediately.',
      'Have the person lie still on their back with legs elevated.',
      'If they are vomiting or bleeding from the mouth, turn them on their side to prevent choking.',
      'If the person stops breathing or has no pulse, begin CPR.',
      'For mild to moderate reactions, remove the allergen if possible (e.g., remove stinger if it is a bee sting).',
      'Apply cold compress to reduce swelling for insect stings or food allergies.',
      'If the person has antihistamines, help them take them as directed.',
      'Watch for signs of anaphylaxis, which can develop rapidly.',
      'Seek medical attention even if symptoms improve, as a secondary reaction may occur.',
    ],
    additionalInfo:
      'Signs of anaphylaxis include difficulty breathing, swelling of the lips, tongue, and throat, rapid, weak pulse, skin rash, nausea, vomiting, and dizziness or fainting.',
    icon: 'alert-triangle',
    color: '#E91E63',
  },
  {
    id: 'drowning',
    title: 'Drowning',
    category: 'medical',
    description:
      'Drowning is the process of experiencing respiratory impairment from submersion/immersion in liquid. Drowning may result in death, survival with injury or illness, or survival with no injury or illness.',
    steps: [
      'Ensure your own safety first. Do not attempt a rescue that would put you at risk.',
      'Call for emergency help (911) immediately.',
      'If possible, reach out to the person with an object they can grab, like a pole or rope.',
      'If you must enter the water, bring a flotation device for yourself and the victim.',
      'Once the person is out of the water, check for breathing and pulse.',
      'If the person is not breathing, begin CPR immediately.',
      'If the person is breathing, place them in the recovery position (on their side) to allow water to drain from their lungs.',
      'Keep the person warm by removing wet clothing and covering with dry blankets.',
      'Even if the person seems fine, they should be evaluated by a medical professional.',
      'Monitor the person closely until emergency services arrive, as their condition can deteriorate rapidly.',
    ],
    additionalInfo:
      'Secondary drowning can occur hours after a water incident. Watch for persistent coughing, trouble breathing, extreme fatigue, irritability, or chest pain.',
    icon: 'droplets',
    color: '#00BCD4',
  },
  {
    id: 'earthquake',
    title: 'Earthquake',
    category: 'natural',
    description:
      "An earthquake is the shaking of the surface of the Earth resulting from a sudden release of energy in the Earth's lithosphere that creates seismic waves.",
    steps: [
      'If you are indoors, DROP to the ground, COVER by getting under a sturdy desk or table, and HOLD ON until the shaking stops.',
      'Stay away from glass, windows, outside doors and walls, and anything that could fall.',
      'If you are in bed, stay there and cover your head with a pillow, unless you are under a heavy light fixture.',
      'Do not use elevators.',
      'If you are outdoors, stay there. Move away from buildings, streetlights, and utility wires.',
      'If you are in a vehicle, stop as quickly as safety permits and stay in the vehicle. Avoid stopping near or under buildings, trees, overpasses, and utility wires.',
      'If you are trapped under debris, do not light a match, move about, or kick up dust.',
      'Tap on a pipe or wall so rescuers can locate you. Use a whistle if one is available. Shout only as a last resort.',
      'After an earthquake, be prepared for aftershocks.',
      'Check yourself and others for injuries. Provide first aid if needed.',
    ],
    additionalInfo:
      'Remember the phrase "Drop, Cover, and Hold On" to help protect yourself during an earthquake.',
    icon: 'activity',
    color: '#795548',
  },
  {
    id: 'flood',
    title: 'Flood',
    category: 'natural',
    description:
      'A flood is an overflow of water that submerges land that is usually dry. Floods can occur during heavy rainfall, when a river overflows, or when a dam breaks.',
    steps: [
      'If a flood is likely in your area, listen to the radio or television for information.',
      'Be aware that flash flooding can occur. If there is any possibility of a flash flood, move immediately to higher ground.',
      'If you must prepare to evacuate, secure your home. Turn off utilities at the main switches or valves if instructed to do so.',
      'Do not walk through moving water. Six inches of moving water can make you fall.',
      'If you have to walk in water, walk where the water is not moving. Use a stick to check the firmness of the ground in front of you.',
      'Do not drive into flooded areas. If floodwaters rise around your car, abandon the car and move to higher ground if you can do so safely.',
      'Do not touch electrical equipment if you are wet or standing in water.',
      'Avoid floodwaters; water may be contaminated by oil, gasoline, or raw sewage.',
      'Stay out of any building if it is surrounded by floodwaters.',
      "Listen for news reports to learn whether the community's water supply is safe to drink.",
    ],
    additionalInfo:
      'Just six inches of rapidly moving water can knock you down, and two feet of water can float a car.',
    icon: 'droplets',
    color: '#3F51B5',
  },
  {
    id: 'poisoning',
    title: 'Poisoning',
    category: 'medical',
    description:
      'Poisoning occurs when any substance interferes with normal body functions after it is swallowed, inhaled, injected, or absorbed. The effects of poisoning range from mild to severe.',
    steps: [
      'Call your local poison control center or emergency number (911) immediately.',
      'If the person inhaled poison, get them to fresh air right away.',
      'If the person has poison on the skin, remove any contaminated clothing and rinse skin with running water for 15 to 20 minutes.',
      'If the person has poison in the eyes, rinse eyes with running water for 15 to 20 minutes.',
      'If the person swallowed the poison, do not give them anything to drink or eat unless directed by a medical professional.',
      'Do not try to make the person vomit unless told to do so by poison control or a medical professional.',
      'If the person starts to vomit, turn their head to the side to prevent choking.',
      'If the person is unconscious, having trouble breathing, or having convulsions, call 911 immediately.',
      'Try to determine what type of poison the person was exposed to, how much, and when.',
      'If possible, keep the poison container to show to emergency responders.',
    ],
    additionalInfo:
      'Keep the number of your local poison control center near your phone. In the United States, you can call the national poison control center at 1-800-222-1222.',
    icon: 'alert-triangle',
    color: '#9C27B0',
  },
  {
    id: 'snake-bite',
    title: 'Snake Bite',
    category: 'medical',
    description:
      'Snake bites can be life-threatening if the snake is venomous. Quick and appropriate action is crucial to minimize the effects of venom.',
    steps: [
      'Move the person away from the snake to prevent additional bites. Remember the appearance of the snake if possible, but do not waste time trying to capture it.',
      'Call emergency services (911) immediately.',
      'Keep the bitten area below the level of the heart to slow the spread of venom.',
      'Remove any tight clothing or jewelry before swelling begins.',
      'Clean the wound with soap and water if available.',
      'Cover the bite with a clean, dry dressing.',
      'Keep the person calm and still to reduce the spread of venom. If possible, carry them rather than having them walk.',
      'Do NOT apply a tourniquet or try to suck out the venom.',
      'Do NOT cut the wound or apply ice.',
      'Do NOT give the person alcohol or medications unless directed by medical professionals.',
    ],
    additionalInfo:
      'Signs of a venomous snake bite may include severe pain, swelling, bruising, bleeding, nausea, vomiting, numbness, difficulty breathing, and blurred vision.',
    icon: 'alert-triangle',
    color: '#8BC34A',
  },
  {
    id: 'broken-bone',
    title: 'Broken Bone',
    category: 'medical',
    description:
      'A broken bone or fracture requires immediate medical attention. Proper first aid can prevent further injury and complications.',
    steps: [
      'Call emergency services (911) for severe fractures or if the person cannot be moved safely.',
      'Keep the injured person still and calm.',
      'If the person is bleeding, apply pressure to the wound with a sterile bandage, clean cloth, or piece of clothing.',
      'Immobilize the injured area. Do not try to realign the bone or push a bone that is sticking out back in.',
      'Apply ice packs wrapped in a towel to limit swelling and help relieve pain. Do not apply ice directly to the skin.',
      'Treat the person for shock if necessary by laying them flat, elevating the feet about 12 inches, and covering them with a coat or blanket.',
      'If the person feels faint or is breathing in short, rapid breaths, lay the person down with the head slightly lower than the trunk and, if possible, elevate the legs.',
      'Do not move the person unless absolutely necessary, especially if you suspect a back or neck injury.',
      'If you must move the person, ensure the injured site is supported to prevent movement.',
      'Seek medical help immediately.',
    ],
    additionalInfo:
      'Signs of a broken bone include pain, swelling, bruising, deformity, inability to use the affected limb, and in some cases, the bone may protrude through the skin.',
    icon: 'alert-triangle',
    color: '#FF5722',
  },
  {
    id: 'heart-attack',
    title: 'Heart Attack',
    category: 'medical',
    description:
      'A heart attack occurs when blood flow to a part of the heart is blocked, usually by a blood clot. Quick action is crucial to minimize heart damage and save a life.',
    steps: [
      'Call emergency services (911) immediately if you suspect someone is having a heart attack.',
      'Have the person sit down, rest, and try to keep calm.',
      'Loosen any tight clothing.',
      'If the person is not allergic to aspirin and has no other contraindications, give them an aspirin to chew (if recommended by emergency services).',
      'If the person stops breathing or has no pulse, begin CPR if you are trained to do so.',
      'If an automated external defibrillator (AED) is available and the person is unconscious with no pulse, use it according to the instructions.',
      'Continue CPR until emergency services arrive or the person shows signs of life.',
      'If the person is conscious, monitor their condition until help arrives.',
      'Note the time when symptoms started and what the person was doing when they began.',
      "If possible, collect information about the person's medical history, medications, and allergies to provide to emergency responders.",
    ],
    additionalInfo:
      'Warning signs of a heart attack include chest pain or discomfort, shortness of breath, pain or discomfort in the jaw, neck, back, arm, or shoulder, and feeling nauseous, light-headed, or unusually tired.',
    icon: 'heart',
    color: '#F44336',
  },
  {
    id: 'stroke',
    title: 'Stroke',
    category: 'medical',
    description:
      'A stroke occurs when blood flow to an area of the brain is cut off, causing brain cells to die. Quick action can minimize brain damage and potential complications.',
    steps: [
      'Recognize the signs of stroke using the FAST method: Face drooping, Arm weakness, Speech difficulty, Time to call 911.',
      'Call emergency services (911) immediately if you suspect someone is having a stroke.',
      'Note the time when symptoms first appeared. This is important for determining treatment options.',
      'Have the person lie down on their side with their head slightly elevated if they are conscious.',
      'Do not give them anything to eat or drink.',
      'If the person is unconscious but breathing, place them in the recovery position (on their side).',
      'If the person is not breathing or has no pulse, begin CPR if you are trained to do so.',
      'Do not give the person any medications, including aspirin, unless directed by emergency services.',
      'Talk to the person reassuringly, even if they cannot respond.',
      "Monitor the person's condition and be prepared to provide updates to emergency responders.",
    ],
    additionalInfo:
      'Remember the acronym FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911. Other symptoms may include sudden numbness, confusion, trouble seeing, difficulty walking, or severe headache.',
    icon: 'brain',
    color: '#9C27B0',
  },
  {
    id: 'hurricane',
    title: 'Hurricane',
    category: 'natural',
    description:
      'Hurricanes are powerful tropical storms with sustained winds of 74 miles per hour or higher. They can cause catastrophic damage to coastal and inland areas.',
    steps: [
      'Stay informed by monitoring weather reports and emergency instructions.',
      'If authorities issue an evacuation order, leave immediately.',
      'If you are not in an evacuation zone, prepare your home by boarding up windows, securing outdoor objects, and turning refrigerators and freezers to the coldest settings.',
      'Fill clean containers with water for drinking, cooking, and sanitation in case water services are disrupted.',
      "Fill your vehicle's gas tank and stock up on emergency supplies, including non-perishable food, water, medications, first-aid supplies, and batteries.",
      'Charge cell phones and other electronic devices before the storm hits.',
      'During the hurricane, stay indoors away from windows and glass doors.',
      'If power is lost, use flashlights instead of candles to reduce fire risk.',
      'If flooding threatens your home, turn off electricity at the main breaker.',
      'After the hurricane, be aware of hazards such as downed power lines, contaminated water, damaged gas lines, and weakened structures.',
    ],
    additionalInfo:
      'Hurricane season in the Atlantic runs from June 1 to November 30, with peak activity typically occurring in September.',
    icon: 'wind',
    color: '#2196F3',
  },
  {
    id: 'wildfire',
    title: 'Wildfire',
    category: 'natural',
    description:
      'Wildfires are unplanned, uncontrolled fires that burn in natural areas such as forests, grasslands, or prairies. They can spread quickly and devastate large areas.',
    steps: [
      'If authorities issue an evacuation order, leave immediately. Follow recommended evacuation routes and do not take shortcuts.',
      'If there is time before evacuating, close all windows, vents, and doors. Remove flammable window coverings and move flammable furniture to the center of the room.',
      'Turn off gas at the meter and turn off pilot lights.',
      'Leave lights on so firefighters can see your house in smoky conditions.',
      'Wet down the roof and shrubs within 15-30 feet of your home if time permits.',
      'If trapped, call 911 and provide your location. Stay low to the ground where air is cooler and contains less smoke.',
      'If caught in the open, find an area with little vegetation, preferably a ditch or depression. Lie face down and cover your body with soil if possible.',
      'After a wildfire, check the roof and extinguish any sparks or embers.',
      'Check for hot spots in your yard and extinguish them with water.',
      'Wear a mask when cleaning up to avoid inhaling ash and other particles.',
    ],
    additionalInfo:
      'Create a defensible space around your home by clearing leaves and other debris within 30 feet. Keep your gutters clean and remove dead vegetation.',
    icon: 'flame',
    color: '#FF5722',
  },
  {
    id: 'carbon-monoxide',
    title: 'Carbon Monoxide Poisoning',
    category: 'home',
    description:
      'Carbon monoxide (CO) is an odorless, colorless gas that can cause sudden illness and death if inhaled. It is produced by burning gasoline, wood, propane, charcoal, or other fuel.',
    steps: [
      'If you suspect carbon monoxide poisoning, get everyone out of the building immediately and into fresh air.',
      'Call emergency services (911) from outside the building.',
      'Do not re-enter the building until emergency responders say it is safe to do so.',
      'If someone is unconscious or unresponsive, move them to fresh air and begin CPR if they are not breathing and you are trained to do so.',
      'Open all doors and windows if it is safe to do so.',
      'Turn off any potential sources of CO such as gas appliances, furnaces, or generators.',
      'Seek medical attention immediately, even if symptoms seem mild. CO poisoning can cause permanent damage.',
      'Tell medical personnel that you suspect CO poisoning.',
      'Do not use generators, grills, camp stoves, or other gasoline, propane, natural gas, or charcoal-burning devices inside a home, basement, garage, or camper.',
      'Install CO detectors on every level of your home and outside sleeping areas.',
    ],
    additionalInfo:
      'Symptoms of CO poisoning include headache, dizziness, weakness, nausea, vomiting, chest pain, and confusion. High levels of CO can cause loss of consciousness and death.',
    icon: 'alert-triangle',
    color: '#FF9800',
  },
  {
    id: 'tsunami',
    title: 'Tsunami',
    category: 'natural',
    description:
      'A tsunami is a series of enormous ocean waves caused by earthquakes, underwater landslides, volcanic eruptions, or asteroids. Tsunamis can travel at speeds of up to 500 miles per hour in the open ocean.',
    steps: [
      'If you are in a coastal area and feel a strong earthquake, drop, cover, and hold on until the shaking stops. Then move quickly to higher ground.',
      'If you see the ocean water recede unusually far, exposing the sea floor, this is a warning sign. Move to higher ground immediately.',
      'Follow evacuation orders issued by authorities. Evacuate on foot if possible to avoid traffic congestion.',
      'If evacuation is not possible, go to the upper floors of a sturdy building, at least 100 feet above sea level.',
      'Stay away from the coast until officials declare it is safe to return. Tsunamis often come in multiple waves that may arrive hours apart.',
      'Do not go to the shore to watch a tsunami. If you can see it, you are too close to escape it.',
      'During a tsunami, avoid downed power lines and stay away from buildings and bridges that may have been damaged by the waves.',
      'If you are caught in tsunami waters, grab onto a floating object and wait for help.',
      'If you are in a boat and there is time, move your boat to deep water (at least 100 fathoms) where tsunamis are less destructive.',
      'After a tsunami, stay away from flooded areas until authorities say it is safe to return.',
    ],
    additionalInfo:
      'A tsunami is not a single wave but a series of waves. The first wave may not be the largest or most destructive.',
    icon: 'droplets',
    color: '#2196F3',
  },
  {
    id: 'volcanic-eruption',
    title: 'Volcanic Eruption',
    category: 'natural',
    description:
      'Volcanic eruptions can release lava, gases, rocks, and ash into the air and surrounding areas. They can cause widespread destruction and pose serious health hazards.',
    steps: [
      'Follow evacuation orders issued by authorities without delay.',
      'If you are indoors during ashfall, close all windows, doors, and dampers. Place damp towels at door thresholds and other draft sources.',
      'Wear a dust mask and goggles to protect your lungs and eyes from ash if you must go outside.',
      'Avoid driving in heavy ashfall as it can damage engines and reduce visibility.',
      'Clear ash from roofs as it is very heavy and can cause buildings to collapse.',
      'Be aware of the danger of mudflows, especially near streams. Mudflows can move faster than you can walk or run.',
      'If caught in a mudflow, move uphill as quickly as possible.',
      'Stay tuned to local news for updates on the eruption and follow instructions from emergency officials.',
      'After an eruption, stay away from volcanic ashfall areas as the fine particles can cause respiratory distress.',
      'When cleaning up ash, wear protective clothing, use water to dampen the ash before removal, and avoid sweeping dry ash as it can become airborne.',
    ],
    additionalInfo:
      'Volcanic ash is actually tiny, jagged particles of rock and glass, not ash like from a fire. It can cause severe respiratory problems and damage machinery.',
    icon: 'flame',
    color: '#FF5722',
  },
  {
    id: 'gas-leak',
    title: 'Gas Leak',
    category: 'home',
    description:
      'Natural gas leaks can be dangerous because the gas is flammable and can cause fire or explosion if ignited. Natural gas is also an asphyxiant and can cause suffocation in enclosed spaces.',
    steps: [
      'If you smell gas (rotten egg odor), hear a hissing sound, or see a broken gas line, evacuate the area immediately.',
      'Do not use any electrical devices, including light switches, phones, or appliances, as they can create a spark.',
      'Do not smoke, light matches, or create any flames.',
      'Do not try to locate the leak or fix a gas pipe yourself.',
      'If possible, turn off the main gas valve, which is usually located near your gas meter. Turn the valve a quarter turn with a wrench so that the valve is perpendicular to the pipe.',
      "Once you are at a safe distance from the leak, call your gas company or emergency services (911) from a cell phone or neighbor's phone.",
      'Do not return to the area until authorities say it is safe to do so.',
      'If someone is experiencing symptoms of gas exposure (dizziness, nausea, headache, fatigue), get them to fresh air immediately and seek medical attention.',
      'After the leak is fixed, have a professional check all gas appliances before using them again.',
      'Consider installing natural gas detectors in your home, especially near gas appliances.',
    ],
    additionalInfo:
      'Natural gas is odorless, but gas companies add a chemical called mercaptan to give it a distinctive rotten egg smell so leaks can be detected.',
    icon: 'alert-triangle',
    color: '#FF9800',
  },
  {
    id: 'electrical-safety',
    title: 'Electrical Safety',
    category: 'home',
    description:
      'Electrical hazards can cause burns, shocks, and even death. Understanding electrical safety is crucial for preventing accidents in the home and workplace.',
    steps: [
      'If you see someone being electrocuted, do not touch them. The current could pass through them to you.',
      'Turn off the power source if possible. Unplug the device or turn off the circuit breaker or fuse box.',
      'If you cannot turn off the power, use a non-conductive object like a wooden broom handle or plastic chair to separate the person from the electrical source.',
      'Once the person is free from the electrical source, check for breathing and pulse. Begin CPR if necessary.',
      'Call emergency services (911) immediately.',
      'For electrical fires, never use water. Use a fire extinguisher rated for electrical fires (Class C).',
      'If an appliance catches fire, unplug it if safe to do so, then use a fire extinguisher.',
      'If a power line falls on your car, stay inside the car. The ground around the car may be energized.',
      'If you must exit the car because of fire or other danger, jump clear of the car without touching the car and the ground at the same time. Land with both feet together and hop away.',
      'Always assume downed power lines are energized. Stay at least 35 feet away and call the power company.',
    ],
    additionalInfo:
      'Water is a conductor of electricity, which is why you should never use water on an electrical fire or touch electrical equipment with wet hands.',
    icon: 'zap',
    color: '#FFC107',
  },
  {
    id: 'winter-storm',
    title: 'Winter Storm',
    category: 'natural',
    description:
      'Winter storms can bring freezing temperatures, heavy snow, ice, strong winds, and dangerous road conditions. Preparation is key to staying safe during severe winter weather.',
    steps: [
      'Stay indoors during the storm if possible.',
      'If you must go outside, wear several layers of warm, loose-fitting clothing, a hat, mittens, and waterproof boots.',
      'Walk carefully on snowy or icy walkways to avoid falling.',
      'Avoid overexertion when shoveling snow. Overexertion can bring on a heart attack—a major cause of death in the winter.',
      'Keep dry. Change wet clothing frequently to prevent a loss of body heat.',
      'Watch for signs of frostbite: loss of feeling and white or pale appearance in extremities such as fingers, toes, ear lobes, and the tip of the nose.',
      'Watch for signs of hypothermia: uncontrollable shivering, memory loss, disorientation, incoherence, slurred speech, drowsiness, and apparent exhaustion.',
      'Conserve fuel by keeping your residence cooler than normal and temporarily closing off heat to some rooms.',
      'If using alternative heating sources like fireplaces or space heaters, take necessary safety precautions and ensure proper ventilation.',
      'Check on elderly neighbors and those who live alone to ensure they are safe and warm.',
    ],
    additionalInfo:
      'Winter storms can last for several days and can cause power outages. Have emergency supplies ready, including non-perishable food, water, flashlights, and extra blankets.',
    icon: 'snowflake',
    color: '#03A9F4',
  },
  {
    id: 'extreme-heat',
    title: 'Extreme Heat',
    category: 'natural',
    description:
      'Extreme heat is a period of high heat and humidity with temperatures above 90 degrees for at least two to three days. In extreme heat, your body works extra hard to maintain a normal temperature, which can lead to heat-related illnesses.',
    steps: [
      'Stay in air-conditioned buildings as much as possible. If your home does not have air conditioning, go to a public place such as a shopping mall or library.',
      'Do not rely on a fan as your primary cooling device during an extreme heat event.',
      "Drink more water than usual and don't wait until you're thirsty to drink.",
      'Avoid alcohol and beverages with high amounts of sugar.',
      'Wear loose, lightweight, light-colored clothing.',
      'Take cool showers or baths to cool down.',
      'Check on friends, family, and neighbors, especially the elderly, young children, and those with health conditions.',
      'Never leave children or pets in cars, even with the windows cracked open.',
      'Avoid strenuous activities during the hottest part of the day (usually between 11 AM and 3 PM).',
      'Use sunscreen with SPF 15 or higher and wear a wide-brimmed hat and sunglasses when outdoors.',
    ],
    additionalInfo:
      'Heat is the leading cause of weather-related deaths in the United States. Heat-related illnesses, like heat exhaustion or heat stroke, happen when the body is not able to properly cool itself.',
    icon: 'thermometer-sun',
    color: '#FF5722',
  },
  {
    id: 'pandemic-preparedness',
    title: 'Pandemic Preparedness',
    category: 'medical',
    description:
      'A pandemic is a global outbreak of a disease. Pandemics happen when a new virus emerges to infect people and can spread between people sustainably.',
    steps: [
      'Stay informed about the pandemic situation through reliable sources like the CDC, WHO, or local health departments.',
      'Practice good hygiene: Wash hands frequently with soap and water for at least 20 seconds, especially after being in public places.',
      'Use hand sanitizer with at least 60% alcohol if soap and water are not available.',
      'Avoid touching your eyes, nose, and mouth with unwashed hands.',
      'Cover coughs and sneezes with a tissue or the inside of your elbow, not your hands.',
      'Clean and disinfect frequently touched surfaces daily, including tables, doorknobs, light switches, countertops, handles, phones, keyboards, and faucets.',
      'Follow guidelines on social distancing, mask-wearing, and other preventive measures as recommended by health authorities.',
      'Stock up on necessary supplies, including prescription medications, over-the-counter medications, food, water, and other household items.',
      'Create a household plan of action, including how to care for sick family members while protecting others.',
      'If you develop symptoms, follow the guidance of health authorities regarding testing, isolation, and seeking medical care.',
    ],
    additionalInfo:
      'Different pandemics may require different responses. Always follow the specific guidance provided by health authorities for the current situation.',
    icon: 'virus',
    color: '#4CAF50',
  },
  {
    id: 'active-shooter',
    title: 'Active Shooter',
    category: 'security',
    description:
      'An active shooter is an individual actively engaged in killing or attempting to kill people in a confined and populated area. Active shooter situations are unpredictable and evolve quickly.',
    steps: [
      'RUN: If there is an accessible escape path, attempt to evacuate the premises. Leave your belongings behind and help others escape if possible.',
      'HIDE: If evacuation is not possible, find a place to hide where the active shooter is less likely to find you. Lock doors, blockade entrances, silence your cell phone, and remain quiet.',
      'FIGHT: As a last resort, and only when your life is in imminent danger, attempt to disrupt and/or incapacitate the active shooter by acting as aggressively as possible, throwing items, improvising weapons, and yelling.',
      'When law enforcement arrives, remain calm and follow instructions. Keep your hands visible at all times and avoid pointing or yelling.',
      'Provide information to law enforcement: location of the shooter, number of shooters, physical description, number and type of weapons, and number of potential victims.',
      'Call 911 when it is safe to do so. Provide as much information as possible about the situation.',
      'If you are in a safe location, do not leave until instructed to do so by law enforcement.',
      'Once you have reached a safe location, try to prevent others from entering the area where the active shooter may be.',
      'If you are wounded, apply pressure to the wound and keep moving if possible until you reach safety.',
      'After the incident, seek help for coping with the emotional impact of the event.',
    ],
    additionalInfo:
      'Remember the phrase "Run, Hide, Fight" as the three basic options for survival during an active shooter situation.',
    icon: 'shield-alert',
    color: '#F44336',
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    category: 'technology',
    description:
      'Cyber security involves protecting computers, servers, mobile devices, electronic systems, networks, and data from digital attacks, theft, and damage.',
    steps: [
      'Use strong, unique passwords for each of your accounts. Consider using a password manager to help generate and store complex passwords.',
      'Enable two-factor authentication (2FA) whenever possible to add an extra layer of security.',
      'Keep your software, operating systems, and apps updated with the latest security patches.',
      'Be cautious about clicking on links or downloading attachments in emails, especially if they are unexpected or from unknown senders.',
      'Use antivirus and anti-malware software and keep it updated.',
      'Back up your important data regularly to an external hard drive or cloud service.',
      'Be careful about the information you share online, especially on social media.',
      'Use secure, encrypted connections when possible, especially when accessing sensitive information. Look for "https" in the URL.',
      'Be wary of public Wi-Fi networks, which can be insecure. Consider using a VPN for additional security.',
      'If you suspect your accounts have been compromised, change your passwords immediately and contact the relevant service providers.',
    ],
    additionalInfo:
      'Phishing attacks, where attackers impersonate legitimate organizations to steal sensitive information, are one of the most common cyber threats. Always verify the source before providing personal information.',
    icon: 'shield',
    color: '#3F51B5',
  },
  {
    id: 'pet-emergency',
    title: 'Pet Emergency',
    category: 'medical',
    description:
      "Pet emergencies can happen suddenly and require immediate action. Knowing how to respond can save your pet's life before you can reach veterinary care.",
    steps: [
      'If your pet is not breathing, check for an airway obstruction. If you can see an object, carefully remove it.',
      'For CPR: Place your pet on their side on a firm surface. For small pets, place your thumb and fingers on either side of the chest. For large pets, place one hand on top of the other over the heart. Compress the chest 1/3 to 1/2 the width of the chest at a rate of 100-120 compressions per minute.',
      'For bleeding, apply direct pressure with a clean cloth or bandage. If blood soaks through, add another layer without removing the first.',
      'For seizures, keep your pet away from furniture or stairs where they could hurt themselves. Do not put your hands near their mouth. Time the seizure and seek veterinary care immediately.',
      'For heatstroke (excessive panting, drooling, reddened gums, vomiting, collapse), move your pet to a cool area and apply cool (not cold) water to their body. Offer small amounts of water to drink and seek immediate veterinary care.',
      'For poisoning, call the Pet Poison Helpline or ASPCA Animal Poison Control Center immediately. Do not induce vomiting unless instructed to do so by a professional.',
      'For choking, if your pet can still breathe, cough, and is conscious, allow them to try to cough up the object. If they cannot breathe, perform the Heimlich maneuver appropriate for their size.',
      'For broken bones, minimize movement and use a makeshift stretcher (board, towel, blanket) to transport your pet to the vet.',
      'Keep your pet warm and as calm as possible during any emergency.',
      "Have your veterinarian's contact information and the nearest emergency veterinary hospital information readily available.",
    ],
    additionalInfo:
      'Create a pet first aid kit that includes gauze, non-stick bandages, adhesive tape, hydrogen peroxide, digital thermometer, tweezers, and a muzzle or cloth to prevent biting in case of pain.',
    icon: 'heart',
    color: '#E91E63',
  },
  {
    id: 'mental-health-crisis',
    title: 'Mental Health Crisis',
    category: 'medical',
    description:
      "A mental health crisis is any situation in which a person's behavior puts them at risk of hurting themselves or others, or prevents them from being able to care for themselves or function in the community.",
    steps: [
      'Stay calm and assess the situation. Determine if there is immediate danger to the person or others.',
      'If there is immediate danger or risk of suicide, call emergency services (911) immediately.',
      'Speak in a calm, reassuring voice. Use short, simple sentences.',
      'Listen without judgment. Let the person know you are there to help.',
      'Remove potential means of self-harm if it is safe to do so.',
      'Do not leave the person alone if they are at risk of harming themselves.',
      'Encourage the person to call a crisis hotline, such as the National Suicide Prevention Lifeline (1-800-273-8255).',
      'If the person has a mental health provider, help them contact this professional.',
      'Avoid threatening, criticizing, or arguing with the person.',
      'If the person agrees to get help, offer to take them to a hospital, crisis center, or to see a mental health professional.',
    ],
    additionalInfo:
      'Warning signs of a mental health crisis may include talking about wanting to die, looking for ways to kill oneself, talking about feeling hopeless or having no purpose, talking about feeling trapped or being in unbearable pain, or being a burden to others.',
    icon: 'brain',
    color: '#9C27B0',
  },
  {
    id: 'chemical-spill',
    title: 'Chemical Spill',
    category: 'home',
    description:
      'Chemical spills can occur in homes, workplaces, or during transportation. They can pose serious health and environmental hazards if not handled properly.',
    steps: [
      'Evacuate the area immediately if the spill is large, involves a highly toxic or volatile substance, or if you experience symptoms like dizziness, nausea, or burning eyes.',
      'If it is safe to do so, ventilate the area by opening windows and doors.',
      'Avoid touching the spilled material or walking through it.',
      'If the chemical is on your skin or clothes, remove contaminated clothing and rinse the affected area with running water for at least 15 minutes.',
      'If the chemical is in your eyes, rinse with lukewarm water for at least 15-20 minutes, holding your eyelids open.',
      'For small, manageable spills of non-hazardous substances, wear appropriate protective gear (gloves, goggles) before cleaning up.',
      'Contain the spill using absorbent materials like kitty litter, sand, or commercial spill kits.',
      'Dispose of contaminated materials properly according to local regulations.',
      'If the spill is large or involves hazardous materials, call your local fire department or hazardous materials team.',
      'Have the Safety Data Sheet (SDS) for the chemical available for emergency responders.',
    ],
    additionalInfo:
      'Always store chemicals in their original containers with labels intact. Never mix chemicals unless specifically instructed to do so, as this can create toxic gases or cause violent reactions.',
    icon: 'alert-triangle',
    color: '#FF9800',
  },
  {
    id: 'water-safety',
    title: 'Water Safety',
    category: 'travel',
    description:
      'Water safety involves preventing accidents and emergencies in or around water, including swimming pools, lakes, rivers, and oceans.',
    steps: [
      'Never swim alone. Always use the buddy system, even at public pools with lifeguards.',
      "Supervise children constantly when they are in or near water. Designate a responsible adult as a 'water watcher'.",
      'Learn to swim and ensure children learn to swim at an early age.',
      'Wear properly fitted life jackets when boating, fishing, or participating in water sports.',
      'Be aware of weather conditions and water temperature before entering water.',
      "Know your limits. If you're not a strong swimmer, stay in shallow water.",
      'Enter water feet first unless the area is clearly marked for diving and has adequate depth.',
      'Avoid alcohol consumption before and during swimming, boating, or water sports.',
      'Learn CPR and basic water rescue skills.',
      'If caught in a rip current, swim parallel to the shore until free of the current, then swim toward shore.',
    ],
    additionalInfo:
      'Drowning is often silent and can happen quickly. A drowning person may not be able to call for help or wave their arms.',
    icon: 'droplets',
    color: '#00BCD4',
  },
  {
    id: 'identity-theft',
    title: 'Identity Theft',
    category: 'security',
    description:
      'Identity theft occurs when someone uses your personal information, such as your name, Social Security number, or credit card number, without your permission, to commit fraud or other crimes.',
    steps: [
      'If you suspect identity theft, place a fraud alert on your credit reports by contacting one of the three major credit bureaus (Equifax, Experian, or TransUnion).',
      'Request credit reports from all three major credit bureaus and review them for suspicious activity.',
      'Report the identity theft to the Federal Trade Commission (FTC) at IdentityTheft.gov or by calling 1-877-438-4338.',
      'File a report with your local police department.',
      'Contact your bank, credit card companies, and other financial institutions to report the fraud and request new account numbers and cards.',
      'Change passwords and PINs for all your accounts, especially financial accounts and email.',
      'Consider placing a credit freeze on your credit reports to prevent new accounts from being opened in your name.',
      'Monitor your credit reports and financial statements regularly for suspicious activity.',
      'If your Social Security number was compromised, contact the Social Security Administration.',
      'If your mail was stolen, contact the Postal Inspection Service.',
    ],
    additionalInfo:
      'Identity theft can take months or even years to resolve. Keep detailed records of all communications related to the identity theft, including dates, names, and copies of any documents.',
    icon: 'shield-alert',
    color: '#3F51B5',
  },
  {
    id: 'data-breach',
    title: 'Data Breach Response',
    category: 'technology',
    description:
      'A data breach occurs when sensitive, protected, or confidential information is accessed, viewed, stolen, or used by an unauthorized individual. This can include personal information, financial data, or business information.',
    steps: [
      'Confirm the breach and identify what data was compromised.',
      'Change all passwords associated with the affected accounts immediately.',
      'Enable two-factor authentication on all accounts that offer it.',
      'Monitor your accounts for suspicious activity, including bank accounts, credit cards, and email.',
      'If financial information was compromised, contact your bank and credit card companies to alert them of potential fraud.',
      'Place a fraud alert or credit freeze on your credit reports by contacting the major credit bureaus.',
      'Report the breach to relevant authorities, such as the Federal Trade Commission (FTC) or your local law enforcement.',
      'If the breach occurred through a company or organization, follow their instructions for next steps.',
      'Consider using identity theft protection services for additional monitoring.',
      'Be cautious of phishing attempts that may follow a data breach, where criminals try to get more information from you by posing as legitimate organizations.',
    ],
    additionalInfo:
      'After a data breach, be especially wary of emails or phone calls claiming to be from the affected company. Legitimate companies will never ask for your password or full Social Security number.',
    icon: 'shield-off',
    color: '#607D8B',
  },
];

export const getGuideById = (id: string): EmergencyGuide | undefined => {
  return emergencyGuides.find((guide) => guide.id === id);
};

export const getGuidesByCategory = (category: string): EmergencyGuide[] => {
  return emergencyGuides.filter((guide) => guide.category === category);
};
