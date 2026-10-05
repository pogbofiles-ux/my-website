/* =========================================================
   DATABASE — The Gym Rat Bible
   ========================================================= */
(function () {
  const EQUIP = {
    barbell: 'Barbell', ez: 'EZ bar', dumbbells: 'Dumbbells', kettlebell: 'Kettlebell', plate: 'Weight plate',
    cable: 'Cable', machine: 'Machine', bench: 'Bench', pullupbar: 'Pull-up bar', dipbars: 'Dip bars',
    abwheel: 'Ab wheel', bodyweight: 'Bodyweight',
  };

  const CATS = {
    upper: { name: 'Upper', full: 'Upper body', desc: 'Chest, back, shoulders and arms. Everything that pushes, pulls and lifts above the waist.', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'traps'] },
    lower: { name: 'Lower', full: 'Lower body', desc: 'Quads, hamstrings, glutes, calves and adductors. The foundation of all your strength.', muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'adductors'] },
    core: { name: 'Core', full: 'Core', desc: 'Abs, obliques and lower back. The stability that protects your spine on every lift.', muscles: ['abs', 'obliques', 'lowerback'] },
  };

  const MUSCLES = {
    chest: { name: 'Chest', cat: 'upper', desc: 'The pectoralis major pushes the arms forward and brings them across the body. Changing the bench angle changes which part works hardest.',
      zones: { 'ch-up': ['Upper chest', 'Clavicular head. Emphasized with an incline bench.'], 'ch-mid': ['Mid chest', 'Sternal head. Flat bench and flyes.'], 'ch-low': ['Lower chest', 'Abdominal head. Declines, dips and high-to-low cables.'] } },
    back: { name: 'Back', cat: 'upper', desc: 'Lats, rhomboids and spinal erectors. Lats give width (the V-taper); rows build thickness and density.',
      zones: { 'bk-lat': ['Lats', 'Width. Pulldowns, pull-ups and pullovers.'], 'bk-mid': ['Mid back', 'Rhomboids and middle traps. Rows with flared elbows.'], 'bk-low': ['Lower back', 'Spinal erectors. Deadlifts and hinges.'] } },
    shoulders: { name: 'Shoulders', cat: 'upper', desc: 'The deltoid has three heads. Complete shoulders need direct work for all three, especially the side and rear delts.',
      zones: { 'sh-ant': ['Front delt', 'Pressing and front raises.'], 'sh-lat': ['Side delt', 'Creates width. Lateral raises.'], 'sh-post': ['Rear delt', 'Reverse flyes, face pulls, reverse pec deck.'] } },
    biceps: { name: 'Biceps', cat: 'upper', desc: 'Flexes the elbow and turns the palm up. The brachialis, underneath the biceps, pushes it outward and makes the arm look thicker.',
      zones: { 'bi-long': ['Long head', 'Outer part — the "peak". Curls with the arm behind the body.'], 'bi-short': ['Short head', 'Inner part. Curls with the elbow in front (preacher, concentration).'], 'bi-brach': ['Brachialis', 'Under the biceps. Neutral grip (hammer).'] } },
    triceps: { name: 'Triceps', cat: 'upper', desc: 'Two thirds of your arm size. It has three heads; the long head is only fully stretched with the arm overhead.',
      zones: { 'tr-long': ['Long head', 'The biggest one. Overhead extensions and skull crushers.'], 'tr-lat': ['Lateral head', 'The outer "horseshoe". Pushdowns and dips.'], 'tr-med': ['Medial head', 'Deep head; works in every extension, especially close-grip.'] } },
    forearms: { name: 'Forearms', cat: 'upper', desc: 'Wrist and finger flexors and extensors. A strong grip improves your rows, pull-ups and deadlifts.',
      zones: { 'fa-flex': ['Flexors', 'Inner side. Wrist curls.'], 'fa-ext': ['Extensors', 'Outer side and brachioradialis. Reverse curls.'], 'fa-grip': ['Grip', 'Holding strength. Carries and hangs.'] } },
    traps: { name: 'Traps', cat: 'upper', desc: 'From the neck to the mid back. Elevates, retracts and depresses the shoulder blades. Key for posture and shoulder health.',
      zones: { 'tp-up': ['Upper traps', 'Elevate the shoulders. Shrugs.'], 'tp-mid': ['Middle traps', 'Squeeze the shoulder blades together. Face pulls and rows.'] } },
    quads: { name: 'Quads', cat: 'lower', desc: 'The four muscles on the front of the thigh. They straighten the knee and are the stars of squats and leg presses.',
      zones: { 'qd-rf': ['Rectus femoris', 'Center of the thigh; crosses the hip. Leg extensions.'], 'qd-vl': ['Vastus lateralis', 'Outer thigh. Squats, leg press and hack squat.'], 'qd-vm': ['Vastus medialis', 'The "teardrop" above the knee. Deep ranges of motion.'] } },
    hamstrings: { name: 'Hamstrings', cat: 'lower', desc: 'Back of the thigh. They bend the knee and extend the hip — train them in both functions.',
      zones: { 'hm-bf': ['Biceps femoris', 'Outer side. Leg curls and hinges.'], 'hm-semi': ['Semitendinosus / semimembranosus', 'Inner side. RDLs and curls with toes pointed in.'] } },
    glutes: { name: 'Glutes', cat: 'lower', desc: 'The biggest muscle in the body. Extends and opens the hip. Strength, power and looks.',
      zones: { 'gl-max': ['Gluteus maximus', 'Hip extension. Hip thrusts, squats, RDLs.'], 'gl-med': ['Gluteus medius', 'Side of the hip; stabilizes the pelvis. Abductions.'] } },
    calves: { name: 'Calves', cat: 'lower', desc: 'Gastrocnemius and soleus. They respond well to full range of motion, pauses at the bottom and high reps.',
      zones: { 'cf-gas': ['Gastrocnemius', 'The visible part. Trained with straight knees.'], 'cf-sol': ['Soleus', 'Under the gastrocnemius. Trained with bent knees (seated).'] } },
    adductors: { name: 'Adductors', cat: 'lower', desc: 'Inner (adductors) and outer (abductors) hip muscles. Knee and hip stability.',
      zones: { 'ad-add': ['Adductors', 'Inner thigh. Bring the legs together.'], 'ad-abd': ['Abductors', 'Outer hip. Push the legs apart.'] } },
    abs: { name: 'Abs', cat: 'core', desc: 'The rectus abdominis flexes the trunk; the transverse abdominis stabilizes it like a natural weight belt.',
      zones: { 'ab-up': ['Upper abs', 'Trunk flexion: crunches.'], 'ab-low': ['Lower abs', 'Posterior pelvic tilt: leg raises.'], 'ab-tva': ['Transverse / stability', 'Anti-extension: planks and ab wheel.'] } },
    obliques: { name: 'Obliques', cat: 'core', desc: 'The sides of the abdomen. They rotate the trunk and, above all, stop it from twisting or bending when it should not.',
      zones: { 'ob-rot': ['Rotation / anti-rotation', 'Woodchoppers, Pallof press, twists.'], 'ob-lat': ['Lateral flexion', 'Side planks and side bends.'] } },
    lowerback: { name: 'Lower back', cat: 'core', desc: 'Spinal erectors and multifidus. They keep your spine neutral during every heavy lift.',
      zones: { 'lb-ere': ['Spinal erectors', 'Back extension: hyperextensions.'], 'lb-stab': ['Stability', 'Control and anti-movement: bird dog.'] } },
  };

  // X(id, name, muscle, also[], zones[], equipment[], level, anim, weight, reps, form, steps[], tips[], mistakes[], secondary[])
  const EX = [];
  function X(id, n, m, also, z, eq, lvl, anim, w, reps, form, steps, tips, err, sec) {
    EX.push({ id, n, m, also: also || [], z, eq, lvl, anim, w, reps, form, steps, tips, err, sec: sec || [] });
  }

  /* ======================= CHEST ======================= */
  X('barbell-bench-press', 'Barbell bench press', 'chest', [], ['ch-mid'], ['barbell', 'bench'], 2, 'benchPress', 'barbell', '4 × 6-10',
    'Correct form starts before the bar moves: shoulder blades squeezed together and down, a slight natural arch, glutes on the bench and feet driving into the floor. The bar travels in a slight diagonal — from over your shoulders down to your lower chest and back. Lower it under control with elbows about 45-70° from your torso, touch the chest without bouncing and press up. Inhale and brace on the way down, exhale as you pass the hardest point on the way up.',
    ['Lie down with your eyes directly under the bar and plant your feet firmly on the floor.', 'Squeeze and lower your shoulder blades, then grip the bar slightly wider than shoulder width.', 'Unrack and lower the bar under control to your lower chest, elbows at 45-70° from your torso.', 'Press up and slightly back toward your face until your arms are straight.'],
    ['Keep a slight arch in your lower back and your glutes on the bench.', 'Always use a spotter or safety pins with heavy weight.', 'Keep your wrists stacked over your elbows, not bent back.'],
    ['Bouncing the bar off your chest.', 'Flaring your elbows to 90° — hard on the shoulders.', 'Lifting your glutes off the bench.'], ['Triceps', 'Front delts']);
  X('dumbbell-bench-press', 'Dumbbell bench press', 'chest', [], ['ch-mid'], ['dumbbells', 'bench'], 1, 'benchPress', 'dumbbell', '3-4 × 8-12',
    'Each arm works independently, so control matters more than weight. Keep your shoulder blades pinned to the bench and lower the dumbbells to the sides of your chest until you feel a deep stretch, with forearms vertical under the weights. Press up and slightly inward so the dumbbells finish over your chest without clanking. Inhale on the way down, exhale while pressing.',
    ['Sit with the dumbbells on your thighs and kick them up as you lie back.', 'Squeeze your shoulder blades; hold the dumbbells at chest level, palms facing your feet.', 'Press up, bringing them slightly together without touching.', 'Lower slowly until you feel a stretch in your chest.'],
    ['It allows a longer range than the barbell — use the stretch.', 'Great for fixing left/right imbalances.', 'Keep your forearms vertical throughout.'],
    ['Dropping the dumbbells too fast and losing control.', 'Banging the dumbbells together at the top.'], ['Triceps', 'Front delts']);
  X('incline-barbell-press', 'Incline barbell press', 'chest', [], ['ch-up'], ['barbell', 'bench'], 2, 'inclinePress', 'barbell', '4 × 6-10',
    'Set the bench at 30-45° — any steeper turns it into a shoulder press. Keep your back and glutes in contact with the pad, shoulder blades retracted. The bar comes down to your upper chest, just below the collarbones, and goes back up in a vertical line over your shoulders. Breathe in at the top, hold the brace on the way down and exhale as you press.',
    ['Set the bench to 30-45°.', 'Pull your shoulder blades back and down; grip slightly wider than your shoulders.', 'Lower the bar to your upper chest, just under the collarbone.', 'Press vertically until your elbows are straight.'],
    ['Above 45° the exercise becomes a shoulder press.', 'Keep your feet planted so you do not slide on the bench.'],
    ['Lowering the bar toward your neck.', 'Lifting your back off the pad.'], ['Front delts', 'Triceps']);
  X('incline-dumbbell-press', 'Incline dumbbell press', 'chest', [], ['ch-up'], ['dumbbells', 'bench'], 1, 'inclinePress', 'dumbbell', '3-4 × 8-12',
    'With the bench around 30°, keep your chest up and shoulder blades pinned. Lower the dumbbells to the sides of your upper chest with elbows slightly tucked, until you feel a good stretch. Drive them up and slightly inward over your upper chest. Control the descent for about two seconds and exhale on the press.',
    ['Set the bench to about 30°. Start with the dumbbells at upper chest height.', 'Press up and slightly inward.', 'Lower under control until you feel a good stretch.'],
    ['The best upper-chest exercise in almost any gym.', 'Turn your palms slightly inward if your shoulders feel uncomfortable.'],
    ['Over-arching your back.', 'Cutting the range of motion short.'], ['Front delts', 'Triceps']);
  X('decline-bench-press', 'Decline bench press', 'chest', [], ['ch-low'], ['barbell', 'bench'], 2, 'declinePress', 'barbell', '3 × 8-10',
    'Hook your feet securely under the rollers before unracking. With a slight decline, the bar path is short: lower it to your lower chest with elbows at about 45°, then press back up over your chest. Keep your shoulder blades retracted and your head on the bench. Always have a spotter help you take and return the bar.',
    ['Hook your feet under the rollers of the decline bench.', 'Unrack the bar with straight arms over your chest.', 'Lower to your lower chest and press back up.'],
    ['Usually lets you move more weight with less shoulder stress.', 'Ask for help to unrack and rerack the bar.'],
    ['Bringing the bar to your neck.', 'Using too steep a decline (head far too low).'], ['Triceps']);
  X('dumbbell-fly', 'Dumbbell fly', 'chest', [], ['ch-mid'], ['dumbbells', 'bench'], 1, 'flyDb', 'dumbbell', '3 × 10-15',
    'A fly is a stretch exercise, not a strength test. Keep a soft, fixed bend in your elbows for the whole rep — the movement only happens at the shoulder. Open your arms in a wide arc until you feel a stretch across your chest (hands roughly level with the bench), then bring them back up as if hugging a big tree. Inhale on the way down, exhale while squeezing up.',
    ['Lie down with the dumbbells above your chest and elbows slightly bent.', 'Open your arms in an arc until you feel a stretch in your chest.', 'Close the arc as if hugging a tree, without changing your elbow angle.'],
    ['Use moderate weight — this is about the stretch.', 'Think "bring the biceps together", not the hands.'],
    ['Fully straightening the elbows.', 'Bending the arms and turning it into a press.'], ['Front delts']);
  X('pec-deck', 'Pec deck (machine fly)', 'chest', [], ['ch-mid'], ['machine'], 1, 'pecDeck', null, '3 × 12-15',
    'Adjust the seat so the handles are level with your mid chest. Sit tall with your back against the pad and shoulder blades slightly pulled back. Bring the handles together in front of your chest with a slight bend in your elbows and squeeze for a second. Return slowly until you feel the stretch, without letting the weight stack slam.',
    ['Set the seat so the handles are at chest height.', 'Back against the pad, elbows slightly bent.', 'Bring your arms together in front of your chest and squeeze for 1 second.', 'Return slowly until you feel the stretch.'],
    ['Perfect for beginners: the path is guided.', 'A great finisher at the end of a chest session.'],
    ['Lifting your back off the pad.', 'Letting the weight yank your arms back.'], ['Front delts']);
  X('cable-crossover', 'Cable crossover (high to low)', 'chest', [], ['ch-low', 'ch-mid'], ['cable'], 2, 'cableCross', null, '3 × 12-15',
    'Set both pulleys high, take a staggered step forward and lean your torso slightly. Keep your chest proud and elbows softly bent and locked in that position. Sweep your hands down and together in front of your hips, crossing them slightly for a full squeeze, then let the cables open your chest back up slowly. Your torso stays still the whole time.',
    ['Set the pulleys high and grab a handle in each hand.', 'Step forward, chest out, slight forward lean.', 'Bring your hands down and together, crossing them in front of your hips.', 'Return under control until your chest opens.'],
    ['Change the pulley height to change the target: low-to-high hits the upper chest more.', 'Constant tension through the whole range.'],
    ['Rocking your torso to help.', 'Bending and straightening your elbows like a press.'], ['Front delts']);
  X('push-up', 'Push-up', 'chest', ['triceps'], ['ch-mid', 'tr-med'], ['bodyweight'], 1, 'pushup', null, '3 × to technical failure',
    'A push-up is a moving plank. Hands slightly wider than your shoulders, body in one straight line from head to heels, glutes and abs tight. Lower your chest toward the floor with elbows at about 45° from your body until your chest almost touches, then push the floor away until your arms are straight. Inhale down, exhale up, and never let your hips sag.',
    ['Hands slightly wider than your shoulders, body straight from head to heels.', 'Squeeze your glutes and abs.', 'Lower your chest until it almost touches the floor, elbows at 45°.', 'Push the floor away until your arms are straight.'],
    ['Too hard? Put your knees down or your hands on a bench.', 'To progress: feet elevated, extra weight or pauses at the bottom.'],
    ['Letting the hips sag.', 'Doing half reps.', 'Elbows fully flared.'], ['Triceps', 'Front delts', 'Core']);
  X('chest-dip', 'Chest dip', 'chest', ['triceps'], ['ch-low'], ['dipbars'], 2, 'dipsChest', null, '3 × 6-12',
    'Lean your torso forward and bend your knees so your body tilts — that shifts the work to the chest. Keep your shoulders down and away from your ears. Lower yourself until your shoulders are roughly level with your elbows (or slightly below if comfortable), then press back up while keeping the forward lean. Stop short of any pain at the front of the shoulder.',
    ['Support yourself on the bars with straight arms.', 'Lean your torso forward and bend your knees.', 'Lower until your shoulders reach elbow height.', 'Press back up while keeping the lean.'],
    ['More lean = more chest; more upright = more triceps.', 'Use the assisted machine if you cannot lift your bodyweight yet.'],
    ['Going too deep with shoulder pain.', 'Swinging your legs.'], ['Triceps', 'Front delts']);
  X('machine-chest-press', 'Machine chest press', 'chest', [], ['ch-mid'], ['machine'], 1, 'chestMachine', null, '3 × 10-12',
    'Set the seat so the handles line up with your mid chest. Keep your back against the pad and shoulder blades back throughout. Press the handles forward until your arms are almost straight, then return slowly until you feel a stretch in your chest, without letting the plates touch. Exhale on the press.',
    ['Adjust the seat so the handles are at mid-chest height.', 'Back against the pad, shoulder blades back.', 'Press until your arms are nearly straight.', 'Return slowly without letting the plates touch.'],
    ['Very safe for training close to failure without a spotter.', 'Ideal for learning the pressing pattern.'],
    ['Seat too high or too low.', 'Slamming your elbows into lockout.'], ['Triceps', 'Front delts']);
  X('dumbbell-pullover', 'Dumbbell pullover', 'chest', ['back'], ['ch-mid', 'bk-lat'], ['dumbbells', 'bench'], 2, 'pullover', 'dumbbell', '3 × 10-12',
    'Hold one dumbbell with both hands over your chest, elbows slightly bent and fixed. Lower it in an arc behind your head until you feel a strong stretch through your chest and lats, keeping your hips down and ribs controlled. Pull it back along the same arc until it is over your chest again. Breathe in deeply as you lower, exhale as you pull.',
    ['Lie down holding a dumbbell with both hands over your chest.', 'With elbows slightly bent, lower the weight in an arc behind your head.', 'When you feel the stretch, pull it back along the same arc to above your chest.'],
    ['Breathe deep on the way down to expand your rib cage.', 'Works chest and lats at the same time.'],
    ['Bending the elbows a lot (it becomes a triceps extension).', 'Going too deep with heavy weight.'], ['Lats', 'Triceps']);

  /* ======================= BACK ======================= */
  X('pull-up', 'Pull-up', 'back', ['biceps'], ['bk-lat'], ['pullupbar'], 3, 'pullup', null, '4 × to technical failure',
    'Start from a full hang with an overhand grip slightly wider than your shoulders. First pull your shoulder blades down (as if putting them in your back pockets), then drive your elbows down toward your ribs until your chin clears the bar. Keep your legs still and core tight. Lower all the way down under control — the full stretch at the bottom counts as much as the top.',
    ['Hang with an overhand grip slightly wider than your shoulders.', 'Pull your shoulder blades down before you start pulling.', 'Pull your elbows toward your ribs until your chin is above the bar.', 'Lower under control until your arms are straight.'],
    ['Cannot do one yet? Use the assisted machine, bands or slow negatives.', 'Think "bend the bar" to switch on your lats.'],
    ['Swinging (kipping) without control.', 'Half reps without straightening your arms.'], ['Biceps', 'Middle traps', 'Forearms']);
  X('lat-pulldown', 'Lat pulldown', 'back', [], ['bk-lat'], ['cable'], 1, 'latPulldown', null, '3-4 × 8-12',
    'Lock your thighs under the pad and take a wide overhand grip. Lean back slightly (about 10-20°) and lift your chest. Pull the bar to your upper chest by driving your elbows down and back, squeezing your lats. Let the bar rise under control until your arms are straight and your lats are fully stretched. Exhale as you pull.',
    ['Adjust the pad over your thighs. Take a wide overhand grip.', 'Lean back slightly and lift your chest.', 'Pull the bar to your upper chest, driving your elbows down.', 'Let it rise slowly until your lats are stretched.'],
    ['The pull-up version for every level.', 'Imagine putting your elbows into your back pockets.'],
    ['Pulling the bar behind your neck.', 'Leaning way back and pulling with your lower back.'], ['Biceps', 'Rear delts']);
  X('close-grip-pulldown', 'Close-grip pulldown', 'back', ['biceps'], ['bk-lat'], ['cable'], 1, 'closePulldown', null, '3 × 10-12',
    'Use a V-handle or close neutral grip. Sit tall with a slight backward lean and your chest up. Pull the handle to your sternum, keeping your elbows close to your body, and squeeze your lats at the bottom. Return slowly until your arms are fully straight and your shoulders rise into a stretch.',
    ['Use a V-handle or a close neutral-grip bar.', 'Chest up, slight lean back.', 'Pull until your hands reach your sternum.', 'Go back up, fully straightening your arms.'],
    ['Longer range of motion than the wide grip.', 'Great for the lower part of the lats.'],
    ['Rounding your shoulders forward at the bottom.', 'Pulling only with your arms.'], ['Biceps']);
  X('seated-cable-row', 'Seated cable row', 'back', [], ['bk-mid', 'bk-lat'], ['cable'], 1, 'seatedRow', null, '3-4 × 10-12',
    'Sit with your feet on the platform and knees slightly bent. Keep your spine neutral and torso nearly upright. Pull the handle toward your belly button, leading with your elbows and squeezing your shoulder blades together. Return by letting your shoulders reach forward for a stretch — without rounding your lower back or swinging your torso.',
    ['Sit with your feet on the platform and knees slightly bent.', 'Neutral spine; grab the handle with straight arms.', 'Pull to your belly button while squeezing your shoulder blades.', 'Return, letting your shoulders stretch forward without rounding your lower back.'],
    ['Pause for 1 second with your shoulder blades squeezed.', 'Elbows tucked = more lats; elbows flared = more mid back.'],
    ['Rocking your torso back and forth.', 'Shrugging your shoulders toward your ears.'], ['Biceps', 'Rear delts']);
  X('barbell-row', 'Barbell row', 'back', [], ['bk-mid', 'bk-lat'], ['barbell'], 2, 'bbRow', 'barbell', '4 × 6-10',
    'Hinge at the hips until your torso is around 30-45° above parallel, knees soft and back flat. Brace your abs hard to protect your lower back. Pull the bar to your belly button by driving your elbows back, keeping it close to your legs, then lower it under control — your torso angle stays the same on every rep.',
    ['Feet hip-width apart; grip the bar slightly wider than your shoulders.', 'Hinge your torso to about 30-45° with a straight back and soft knees.', 'Pull the bar to your belly button, driving your elbows back.', 'Lower under control without losing the position.'],
    ['Brace your abs to protect your lower back.', 'One of the best builders of back thickness.'],
    ['Rounding your back.', 'Standing up with every rep to use momentum.'], ['Biceps', 'Lower back', 'Rear delts']);
  X('one-arm-dumbbell-row', 'One-arm dumbbell row', 'back', [], ['bk-lat', 'bk-mid'], ['dumbbells', 'bench'], 1, 'dbRow', 'dumbbell', '3 × 10-12 per side',
    'Support yourself with one hand (and optionally the same-side knee) on a bench, back flat and roughly parallel to the floor. Let the dumbbell hang straight down to stretch the lat. Pull it toward your hip in a slight arc, elbow close to your side, and keep your torso square — no twisting. Lower until your arm is fully straight.',
    ['Rest one hand (and your knee if you like) on a bench.', 'Back flat and parallel to the floor, dumbbell hanging.', 'Pull the dumbbell toward your hip, elbow close to your body.', 'Lower until your lat is stretched.'],
    ['Drive your elbow "toward your back pocket".', 'The support lets you use heavy weight safely.'],
    ['Twisting your torso to lift the weight.', 'Pulling to your chest instead of your hip.'], ['Biceps', 'Rear delts']);
  X('t-bar-row', 'T-bar row', 'back', [], ['bk-mid'], ['barbell'], 2, 'tbarRow', null, '3-4 × 8-10',
    'Straddle the bar with your chest up and back flat, hinged forward at the hips. Grip the handle close to the plates. Pull it toward your lower chest, squeezing your shoulder blades together at the top, then lower it under control without letting your back round or your legs drive the weight.',
    ['Anchor one end of a barbell in a corner or T-bar station.', 'Straddle it and grab a V-handle near the plates.', 'Torso hinged, back neutral — pull toward your lower chest.', 'Lower under control.'],
    ['Lets you load a lot of weight with good stability.', 'Squeeze your shoulder blades together at the top.'],
    ['Rounding your back.', 'Using your legs to lift the weight.'], ['Biceps', 'Middle traps']);
  X('straight-arm-pulldown', 'Straight-arm pulldown', 'back', [], ['bk-lat'], ['cable'], 2, 'straightArm', null, '3 × 12-15',
    'Stand facing a high pulley with a slight hip hinge and arms almost straight. Sweep the bar down in an arc to your thighs using only your lats — your elbows keep the same slight bend the whole time. Squeeze at the bottom and let the bar rise slowly until your lats stretch overhead. Your torso stays still.',
    ['High pulley with a bar or rope. Step back and lean your torso slightly.', 'Arms almost straight, sweep the bar in an arc down to your thighs.', 'Squeeze your lats at the bottom and return slowly to the top.'],
    ['Isolates the lats without the biceps helping.', 'Perfect lat activation before pull-ups.'],
    ['Bending the elbows and turning it into a press.', 'Moving your torso up and down.'], ['Triceps (long head)']);
  X('deadlift', 'Conventional deadlift', 'back', ['hamstrings', 'glutes', 'lowerback', 'traps'], ['bk-low', 'bk-mid', 'lb-ere', 'gl-max'], ['barbell'], 3, 'deadlift', 'barbell', '3-5 × 3-6',
    'Set up with the bar over your mid-foot. Hinge down and grip just outside your legs, hips higher than knees, back flat, chest up and shoulders slightly in front of the bar. Take a big breath, brace your abs and pull the slack out of the bar. Push the floor away with your legs and keep the bar dragging up your legs until you stand tall with glutes squeezed. Return it to the floor the same way, hips back first.',
    ['Bar over the middle of your foot, feet hip-width apart.', 'Grip just outside your legs: hips back, back neutral, chest up.', 'Brace, then push the floor away with your legs, keeping the bar against your legs.', 'Lock out by squeezing your glutes and return the bar the same way.'],
    ['Take a deep breath and brace your abs before every rep.', 'Start light and film your technique.'],
    ['Rounding your back.', 'Letting the bar drift away from your body.', 'Leaning back excessively at lockout.'], ['Glutes', 'Hamstrings', 'Traps', 'Forearms']);

  /* ======================= SHOULDERS ======================= */
  X('overhead-press', 'Barbell overhead press', 'shoulders', ['triceps'], ['sh-ant'], ['barbell'], 2, 'ohp', 'barbell', '4 × 5-8',
    'Stand with the bar resting on your upper chest and a shoulder-width grip, forearms vertical. Squeeze your glutes and abs so your ribs stay down. Press the bar straight up, moving your head back slightly to clear it, then push your head "through the window" once the bar passes your forehead. Finish with the bar stacked over your mid-foot and arms locked.',
    ['Stand with the bar on your upper chest, shoulder-width grip.', 'Squeeze your glutes and abs.', 'Press the bar straight up, tilting your head back slightly.', 'Once it passes your forehead, bring your head forward and lock out overhead.'],
    ['The king of shoulder strength.', 'Keep your ribs down — do not arch your back.'],
    ['Arching your lower back.', 'Pressing the bar forward instead of straight up.'], ['Triceps', 'Side delts', 'Core']);
  X('seated-dumbbell-press', 'Seated dumbbell shoulder press', 'shoulders', [], ['sh-ant', 'sh-lat'], ['dumbbells', 'bench'], 1, 'dbPress', 'dumbbell', '3-4 × 8-12',
    'Sit on an almost upright bench with your back against the pad. Start with the dumbbells at shoulder height, elbows slightly in front of your body and forearms vertical. Press up until the dumbbells almost touch overhead, then lower them slowly to ear level. Exhale as you press.',
    ['Set the bench nearly upright. Dumbbells at shoulder height.', 'Elbows slightly in front of your body.', 'Press up until the dumbbells almost meet.', 'Lower until they are level with your ears.'],
    ['Easier on the shoulders than the barbell.', 'Control the descent for 2 seconds.'],
    ['Lifting your back off the pad.', 'Only lowering halfway.'], ['Triceps']);
  X('arnold-press', 'Arnold press', 'shoulders', [], ['sh-ant', 'sh-lat'], ['dumbbells', 'bench'], 2, 'arnold', 'dumbbell', '3 × 8-12',
    'Begin with the dumbbells in front of your face, palms facing you and elbows in front. As you press up, open your elbows out to the sides and rotate your palms to face forward, finishing with straight arms overhead. Reverse the rotation smoothly on the way down. Keep the movement fluid and your back against the pad.',
    ['Start with the dumbbells in front of your face, palms facing you.', 'As you press up, open your elbows and rotate your palms forward.', 'Finish at the top with straight arms.', 'Reverse the rotation as you lower.'],
    ['More time under tension and range for the front delts.', 'Use a bit less weight than a normal press.'],
    ['Rushing the rotation.', 'Arching your back.'], ['Triceps']);
  X('lateral-raise', 'Lateral raise', 'shoulders', [], ['sh-lat'], ['dumbbells'], 1, 'lateralRaise', 'dumbbell', '4 × 12-20',
    'Stand tall with a slight forward lean and a soft bend in your elbows. Raise the dumbbells out to your sides until your arms are about parallel to the floor, leading with your elbows, not your hands. Think of pushing the weights out toward the walls rather than up to the ceiling. Keep your shoulders down away from your ears and lower slowly.',
    ['Stand with the dumbbells at your sides and a slight bend in your elbows.', 'Raise your arms out to the sides to shoulder height.', 'Imagine pushing the dumbbells toward the walls, not the ceiling.', 'Lower slowly.'],
    ['The key exercise for wide shoulders.', 'Light weight, perfect form — leave your ego at the door.'],
    ['Swinging your body to lift.', 'Shrugging your shoulders (traps take over).', 'Raising above shoulder height.'], ['Upper traps']);
  X('cable-lateral-raise', 'Cable lateral raise', 'shoulders', [], ['sh-lat'], ['cable'], 2, 'cableLateral', null, '3 × 12-15 per side',
    'Stand side-on to a low pulley and hold the handle with your far hand, the cable crossing in front of your body. Hold the machine with your free hand for stability. Raise your arm out to the side to shoulder height with a soft elbow, then lower slowly — the cable keeps tension on the side delt even at the bottom.',
    ['Low pulley. Stand side-on and grab the handle with the far hand.', 'Raise your arm out to the side to shoulder height.', 'Lower under control, keeping tension the whole way.'],
    ['The cable provides tension at the bottom, where a dumbbell does not.', 'Hold the post with your other hand.'],
    ['Leaning to help.', 'Twisting your torso.'], []);
  X('front-raise', 'Front raise', 'shoulders', [], ['sh-ant'], ['dumbbells/plate'], 1, 'frontRaise', 'dumbbell', '3 × 10-15',
    'Stand tall with the weight in front of your thighs and a soft bend in your elbows. Raise the weight straight in front of you to about eye level, keeping your torso completely still, then lower it under control. If your body has to swing, the weight is too heavy.',
    ['Stand with the weight in front of your thighs.', 'Raise your almost-straight arms forward to eye level.', 'Lower under control.'],
    ['If you already press a lot, your front delts are probably well trained.', 'You can use a plate held with both hands.'],
    ['Swinging your body.', 'Lifting too fast.'], ['Upper chest']);
  X('reverse-fly', 'Bent-over reverse fly', 'shoulders', [], ['sh-post'], ['dumbbells'], 1, 'rearFly', 'dumbbell', '3-4 × 12-20',
    'Hinge forward until your torso is nearly parallel to the floor with a flat back. Let the dumbbells hang under your chest with a slight bend in your elbows. Raise them out to the sides, leading with the back of your hands, until your arms are level with your body. Do not squeeze your shoulder blades hard — keep the work in the rear delts — and lower slowly.',
    ['Hinge your torso almost parallel to the floor with a straight back.', 'Let the dumbbells hang under your chest, elbows slightly bent.', 'Open your arms to the sides, leading with the back of your hands.', 'Lower slowly.'],
    ['You can also do it chest-supported on an incline bench.', 'Use light weight — the rear delt is small.'],
    ['Squeezing your shoulder blades hard (it becomes a row).', 'Using momentum.'], ['Middle traps', 'Rhomboids']);
  X('reverse-pec-deck', 'Reverse pec deck', 'shoulders', [], ['sh-post'], ['machine'], 1, 'reverseDeck', null, '3 × 12-15',
    'Sit facing the pad of the pec deck with your chest against it. Grab the handles with arms straight out in front at shoulder height. Sweep your arms back in a wide arc until they are in line with your body, keeping a soft elbow, then return slowly. Keep your neck relaxed and chest glued to the pad.',
    ['Sit facing the backrest of the pec deck machine.', 'Grab the handles with your arms in front of you.', 'Open your arms back until they line up with your body.', 'Return slowly.'],
    ['The easiest way to isolate the rear delts.', 'Keep your chest against the pad.'],
    ['Pushing your head forward.', 'Bending your elbows to move more weight.'], ['Middle traps']);
  X('face-pull', 'Face pull', 'shoulders', ['traps'], ['sh-post', 'tp-mid'], ['cable'], 1, 'facePull', null, '3 × 15-20',
    'Set a rope at face height and grab it with palms facing down. Step back, stand tall and pull the rope toward your forehead while spreading the ends apart. Keep your elbows high — at or above shoulder level — and finish by rotating your hands back as if showing your biceps. Return slowly without leaning back.',
    ['Rope at face height. Overhand grip.', 'Pull the rope toward your forehead while spreading your hands.', 'Keep your elbows high and rotate your shoulders out at the end.', 'Return under control.'],
    ['Excellent for shoulder health and posture.', 'Do it in almost every upper-body session.'],
    ['Pulling to your chest with low elbows.', 'Leaning back.'], ['Middle traps', 'Rotator cuff']);
  X('upright-row', 'Upright row', 'shoulders', ['traps'], ['sh-lat', 'tp-up'], ['barbell'], 2, 'uprightRow', 'barbell', '3 × 10-12',
    'Use a shoulder-width or slightly wider grip — a narrow grip can pinch the shoulder. Pull the bar up close to your body, leading with your elbows out to the sides. Stop when your elbows reach shoulder height and your hands are around chest level, then lower under control. Your elbows should always stay higher than your hands.',
    ['Stand and grip the bar at shoulder width or a bit wider.', 'Lift the bar close to your body, driving your elbows out and up.', 'Stop when your elbows reach shoulder height.', 'Lower under control.'],
    ['A wider grip is safer for the shoulders.', 'Elbows always above the hands.'],
    ['Grip too narrow.', 'Going above shoulder height if you feel pinching.'], ['Upper traps']);

  /* ======================= BICEPS ======================= */
  X('barbell-curl', 'Barbell curl', 'biceps', [], ['bi-short', 'bi-long'], ['barbell'], 1, 'curl', 'barbell', '3-4 × 8-12',
    'Stand tall with an underhand, shoulder-width grip and your elbows pinned to your sides. Curl the bar up by bending only at the elbows until your forearms are nearly vertical, squeeze your biceps, then lower slowly to full extension. Your shoulders and torso must not move — if you have to swing, drop the weight.',
    ['Stand with an underhand grip at shoulder width.', 'Elbows pinned to your sides.', 'Curl the bar up to your shoulders by bending your elbows.', 'Lower slowly until your arms are straight.'],
    ['An EZ bar is more comfortable for the wrists.', 'Control the lowering: 2-3 seconds.'],
    ['Swinging your body.', 'Moving your elbows forward as you curl.'], ['Forearms']);
  X('dumbbell-curl', 'Dumbbell curl', 'biceps', [], ['bi-short', 'bi-long'], ['dumbbells'], 1, 'curl', 'dumbbell', '3 × 10-12',
    'Start with the dumbbells at your sides, palms facing in. As you curl, rotate your palms up (supinate) so the biceps does its full job, keeping your elbows by your sides. Squeeze at the top and lower slowly, turning the palms back in. Alternating arms helps you focus on each side.',
    ['Standing or seated, dumbbells at your sides with palms facing in.', 'Curl up while rotating your palm upward (supination).', 'Squeeze at the top and lower under control.'],
    ['Alternating arms lets you focus on each one.', 'Turn your pinky up at the top for a stronger contraction.'],
    ['Swinging the dumbbells.', 'Moving your shoulder forward.'], ['Forearms']);
  X('hammer-curl', 'Hammer curl', 'biceps', ['forearms'], ['bi-brach', 'fa-ext'], ['dumbbells'], 1, 'curl', 'dumbbell', '3 × 10-12',
    'Hold the dumbbells with palms facing each other (neutral grip) and keep that grip the whole time. Curl them up with your elbows fixed at your sides, like swinging a hammer in slow motion, and lower them under control. This grip shifts the work to the brachialis and brachioradialis.',
    ['Dumbbells at your sides, palms facing each other (neutral grip).', 'Curl up without rotating your wrists.', 'Lower under control.'],
    ['Builds arm thickness through the brachialis and brachioradialis.', 'You can also curl across your body toward your chest.'],
    ['Using momentum.', 'Letting your elbows flare out.'], ['Brachioradialis', 'Forearms']);
  X('preacher-curl', 'Preacher curl', 'biceps', [], ['bi-short'], ['ez', 'bench'], 1, 'preacher', 'ez', '3 × 8-12',
    'Sit so the back of your upper arms rests fully on the pad and your armpits are snug against the top. Curl the EZ bar up until your forearms are nearly vertical, then lower slowly until your elbows are almost straight. Be extra careful at the bottom — never drop the weight into the stretch.',
    ['Sit and rest the back of your arms on the pad.', 'Grab the EZ bar with an underhand grip.', 'Curl until your forearms are nearly vertical.', 'Lower slowly until your elbows are almost straight.'],
    ['Removes cheating: your arms cannot move.', 'Be careful at the bottom — it is the most demanding point for the tendon.'],
    ['Dropping the weight at the bottom.', 'Lifting your elbows off the pad.'], ['Brachialis']);
  X('incline-dumbbell-curl', 'Incline dumbbell curl', 'biceps', [], ['bi-long'], ['dumbbells', 'bench'], 2, 'inclineCurl', 'dumbbell', '3 × 8-12',
    'Set a bench at 45-60° and lie back with your arms hanging straight down behind your torso. Curl the dumbbells up without letting your elbows drift forward, then lower to a full stretch. Having the arm behind your body stretches the long head of the biceps for a big stimulus.',
    ['Set the bench to 45-60°. Lie back with your arms hanging behind your torso.', 'Curl the dumbbells up without moving your elbows forward.', 'Lower under control to a full stretch.'],
    ['The arm behind the body stretches the long head — great stimulus.', 'Use less weight than for standing curls.'],
    ['Rolling your shoulders forward.', 'Cutting the bottom short.'], []);
  X('cable-curl', 'Cable curl', 'biceps', [], ['bi-short'], ['cable'], 1, 'cableCurl', null, '3 × 12-15',
    'Stand facing a low pulley with a bar or rope. Keep your elbows pinned at your sides and curl up until your hands reach shoulder height. Squeeze, then lower slowly — the cable keeps tension on the biceps through the whole movement. Stand tall without leaning back.',
    ['Low pulley with a bar or rope.', 'Elbows pinned, curl up by bending your elbows.', 'Squeeze at the top and lower under control.'],
    ['Constant tension through the whole range.', 'A good exercise to finish a session.'],
    ['Leaning back.', 'Moving your elbows.'], ['Forearms']);
  X('concentration-curl', 'Concentration curl', 'biceps', [], ['bi-short'], ['dumbbells'], 1, 'concentration', 'dumbbell', '3 × 10-12 per arm',
    'Sit on a bench, lean forward and brace the back of your working arm against your inner thigh. Curl the dumbbell toward your shoulder, turning your pinky up at the top, squeeze for a second and lower slowly to full extension. Only the forearm moves.',
    ['Seated, rest the back of your arm against your inner thigh.', 'Curl the dumbbell toward your shoulder.', 'Squeeze for 1 second at the top and lower slowly.'],
    ['Maximum isolation and mind-muscle connection.', 'Turn your pinky up as you curl.'],
    ['Moving your shoulder.', 'Lowering without control.'], []);
  X('chin-up', 'Chin-up', 'biceps', ['back'], ['bi-short', 'bi-long', 'bk-lat'], ['pullupbar'], 2, 'chinup', null, '3 × to technical failure',
    'Hang from the bar with palms facing you and hands about shoulder-width apart. Pull your shoulder blades down, then pull your chest toward the bar until your chin clears it, keeping your body still. Lower all the way down with control until your arms are straight.',
    ['Hang with your palms facing you, hands shoulder-width apart.', 'Pull your chest toward the bar.', 'Get your chin over the bar and lower under control.'],
    ['The best compound exercise for biceps.', 'Easier than overhand pull-ups — a good entry point.'],
    ['Swinging.', 'Not straightening your arms at the bottom.'], ['Lats']);

  /* ======================= TRICEPS ======================= */
  X('triceps-pushdown', 'Triceps pushdown (bar)', 'triceps', [], ['tr-lat', 'tr-med'], ['cable'], 1, 'pushdown', null, '3-4 × 10-15',
    'Stand close to a high pulley with a slight forward lean and grab a straight or V-bar with an overhand grip. Pin your elbows to your sides — they are the hinge and must not move. Push the bar down until your arms are fully straight, squeeze your triceps, then let your forearms rise until they are about parallel to the floor.',
    ['High pulley with a straight or V-bar. Overhand grip.', 'Elbows pinned to your sides, slight forward lean.', 'Extend your elbows until your arms are locked out.', 'Return until your forearms are parallel to the floor.'],
    ['Your elbows do not move: only the forearms work.', 'Squeeze your triceps at the bottom for 1 second.'],
    ['Flaring your elbows.', 'Leaning your bodyweight onto the bar.'], []);
  X('rope-pushdown', 'Rope pushdown', 'triceps', [], ['tr-lat'], ['cable'], 1, 'pushdown', null, '3 × 12-15',
    'Use a rope on a high pulley with a neutral grip. Elbows stay tight to your sides as you push down. At the bottom, pull the rope ends apart and outward to finish the contraction, then let the rope rise slowly to about 90° at the elbow.',
    ['High pulley with a rope. Neutral grip.', 'Elbows pinned, extend downward.', 'Spread your hands apart at the bottom.', 'Return under control.'],
    ['Spreading the rope adds an extra squeeze for the lateral head.', 'Excellent for the triceps "horseshoe".'],
    ['Moving your shoulders.', 'Coming up past 90° of elbow bend.'], []);
  X('overhead-dumbbell-extension', 'Overhead dumbbell extension', 'triceps', [], ['tr-long'], ['dumbbells'], 1, 'overheadDb', 'dumbbell', '3 × 10-12',
    'Hold one dumbbell with both hands overhead, elbows pointing to the ceiling and close to your head. Lower the weight behind your head by bending only your elbows until you feel a deep stretch in the back of your arms, then extend back up. Brace your abs so your lower back does not arch.',
    ['Standing or seated, hold a dumbbell with both hands overhead.', 'Elbows point to the ceiling, close to your head.', 'Lower the dumbbell behind your head by bending your elbows.', 'Extend back up.'],
    ['The overhead position stretches the long head — the best stimulus for it.', 'Brace your abs so your back does not arch.'],
    ['Flaring your elbows wide.', 'Arching your lower back.'], []);
  X('overhead-cable-extension', 'Overhead cable extension', 'triceps', [], ['tr-long'], ['cable'], 2, 'overheadCable', null, '3 × 12-15',
    'Face away from the pulley holding the rope behind your head. Step forward into a staggered stance and lean your torso forward. Keep your upper arms fixed beside your head and extend your elbows forward and up until your arms are straight, then let the rope pull your hands back for a full stretch.',
    ['Rope on the cable. Turn around and hold it behind your head.', 'Step forward with your torso leaning.', 'Extend your arms forward and up.', 'Return, letting the rope stretch your triceps.'],
    ['Constant tension in the stretched position.', 'Keep your elbows in the same place.'],
    ['Moving your elbows back and forth.', 'Using your back.'], []);
  X('skull-crusher', 'Skull crusher (lying triceps extension)', 'triceps', [], ['tr-long', 'tr-med'], ['ez', 'bench'], 2, 'skull', 'ez', '3 × 8-12',
    'Lie on a flat bench holding an EZ bar above your chest, then tilt your arms slightly back toward your head. Bending only at the elbows, lower the bar toward your forehead or just behind your head. Keep your elbows pointing up and in, then extend back to the start. Start light — the elbows take a lot of stress here.',
    ['Lie on a flat bench with the EZ bar above your chest.', 'Tilt your arms slightly toward your head.', 'Lower the bar toward your forehead (or behind your head) by bending only your elbows.', 'Extend back to the start.'],
    ['Lowering behind your head gives the long head more stretch.', 'Start light: take care of your elbows.'],
    ['Flaring your elbows.', 'Moving your shoulders and turning it into a press.'], []);
  X('close-grip-bench-press', 'Close-grip bench press', 'triceps', ['chest'], ['tr-med', 'tr-lat'], ['barbell', 'bench'], 2, 'benchPress', 'barbell', '4 × 6-10',
    'Set up like a normal bench press but grip the bar about shoulder-width apart. Keep your elbows tucked close to your body as you lower the bar to your lower chest, then press up by driving through your triceps. Do not grip too narrow — it strains the wrists without extra benefit.',
    ['Lie down and grip the bar at shoulder width.', 'Keep your elbows close to your body on the way down.', 'Lower to your lower chest.', 'Press until your arms are straight.'],
    ['Lets you move a lot of weight with the triceps.', 'Do not bring your hands too close — it hurts the wrists.'],
    ['Grip too narrow.', 'Flaring your elbows.'], ['Chest', 'Front delts']);
  X('triceps-dip', 'Triceps dip', 'triceps', [], ['tr-lat', 'tr-med'], ['dipbars'], 2, 'dipsTri', null, '3 × 8-12',
    'Support yourself on the bars with your torso upright and shoulders pulled down. Lower yourself by bending your elbows straight back, keeping them close to your body, until your upper arms are about parallel to the floor. Press back up to full lockout. Staying vertical keeps the focus on the triceps.',
    ['Support yourself on the bars with your torso upright.', 'Lower by bending your elbows, keeping them close to your body.', 'Stop when your upper arms are parallel to the floor.', 'Press up until your elbows lock.'],
    ['Upright torso = more triceps.', 'Add weight once you can do more than 12 reps.'],
    ['Leaning forward (shifts to the chest).', 'Going too deep with discomfort.'], ['Lower chest', 'Front delts']);
  X('bench-dip', 'Bench dip', 'triceps', [], ['tr-lat'], ['bench'], 1, 'benchDips', null, '3 × 10-15',
    'Place your hands on the edge of a bench behind you, fingers forward, legs out in front. Keep your back close to the bench and lower yourself by bending your elbows straight back until they reach about 90°. Push back up through your palms until your arms are straight. Do not go deeper than your shoulders comfortably allow.',
    ['Put your hands on the edge of a bench behind you.', 'Legs out in front, hips close to the bench.', 'Lower by bending your elbows back.', 'Push up until your arms are straight.'],
    ['Bend your knees to make it easier.', 'Keep your back close to the bench.'],
    ['Going too deep — stresses the shoulder.', 'Drifting away from the bench.'], []);
  X('triceps-kickback', 'Triceps kickback', 'triceps', [], ['tr-lat'], ['dumbbells'], 1, 'kickback', 'dumbbell', '3 × 12-15',
    'Hinge forward with a flat back and lift your upper arm until it is parallel to your torso, elbow tucked. Keeping that upper arm still, extend your elbow to kick the dumbbell back until your arm is straight, squeeze, then return to 90°. Light weight and a hard squeeze beat heavy swinging.',
    ['Hinge your torso with a straight back.', 'Upper arm close to your body and parallel to the floor.', 'Extend your elbow, moving the dumbbell back.', 'Return to 90° under control.'],
    ['Light weight and a strong squeeze at the top.', 'The upper arm does not move.'],
    ['Swinging the dumbbell.', 'Letting your elbow drop.'], []);
  X('diamond-push-up', 'Diamond push-up', 'triceps', ['chest'], ['tr-med', 'tr-lat'], ['bodyweight'], 2, 'pushup', null, '3 × to technical failure',
    'Place your hands together under your chest so your thumbs and index fingers form a diamond. Keep your body in a straight line and elbows close to your sides. Lower your chest toward your hands, then press back up to straight arms. Drop to your knees if needed to keep perfect form.',
    ['Bring your hands together to form a diamond with your index fingers and thumbs.', 'Body straight, elbows tucked.', 'Lower your chest toward your hands and push back up.'],
    ['Too hard? Put your knees down.', 'A great option with no equipment.'],
    ['Flaring your elbows.', 'Letting your hips sag.'], ['Chest']);

  /* ======================= FOREARMS ======================= */
  X('wrist-curl', 'Wrist curl', 'forearms', [], ['fa-flex'], ['dumbbells', 'bench'], 1, 'wristCurl', 'dumbbell', '3 × 15-20',
    'Sit with your forearms resting on your thighs, palms up and wrists just past your knees. Let the weight roll down toward your fingertips for a full stretch, then curl your wrists up as high as possible. Only the wrists move — your forearms stay glued to your legs.',
    ['Sit with your forearms on your thighs, palms up.', 'Let the dumbbell roll down toward your fingers.', 'Flex your wrist to lift the weight.'],
    ['High reps and full range of motion.', 'Can also be done with a barbell.'],
    ['Moving your forearms.', 'Using too much weight.'], []);
  X('reverse-wrist-curl', 'Reverse wrist curl', 'forearms', [], ['fa-ext'], ['barbell', 'bench'], 1, 'revWristCurl', 'barbell', '3 × 15-20',
    'Rest your forearms on your thighs with palms facing down and wrists hanging over your knees. Let your hands drop, then lift the back of your hands toward the ceiling by extending your wrists. Use light weight and slow reps — the extensors are small.',
    ['Forearms on your thighs, palms facing down.', 'Let your wrist drop.', 'Extend your wrist to lift the weight.'],
    ['Balances flexor work and helps prevent tennis elbow.', 'Light weight.'],
    ['Using momentum.', 'Short range of motion.'], []);
  X('reverse-curl', 'Reverse curl', 'forearms', ['biceps'], ['fa-ext', 'bi-brach'], ['barbell'], 1, 'curl', 'barbell', '3 × 10-15',
    'Hold the bar with an overhand grip (palms down) at shoulder width. Keep your elbows by your sides and wrists straight as you curl the bar up to your shoulders, then lower slowly. The overhand grip makes the brachioradialis and forearm extensors do the work.',
    ['Grab the bar with your palms facing down.', 'Elbows pinned, curl the bar up to your shoulders.', 'Lower under control.'],
    ['Works the brachioradialis — the most visible forearm muscle.', 'Use an EZ bar if your wrists hurt.'],
    ['Bending your wrists.', 'Swinging.'], ['Brachialis']);
  X('farmers-walk', 'Farmer\'s walk', 'forearms', ['traps'], ['fa-grip', 'tp-up'], ['dumbbells/kettlebell'], 1, 'farmer', 'dumbbell', '3 × 30-40 m',
    'Deadlift two heavy dumbbells from the floor with a flat back. Stand tall with shoulders back and down, abs braced and the weights hanging by your sides. Walk with short, controlled steps, keeping your torso upright and the dumbbells from swinging. Breathe steadily throughout.',
    ['Pick up two heavy dumbbells with a straight back.', 'Stand tall: shoulders back, abs tight.', 'Walk with short, controlled steps.'],
    ['Grip, traps, core and conditioning all at once.', 'Increase the distance or the weight every week.'],
    ['Hunching over.', 'Letting the dumbbells swing.'], ['Traps', 'Core', 'Calves']);
  X('dead-hang', 'Dead hang', 'forearms', [], ['fa-grip'], ['pullupbar'], 1, 'deadHang', null, '3 × 30-60 s',
    'Grab the bar with an overhand grip and hang with straight arms. Keep your shoulders slightly engaged (not shrugged up to your ears) and your body still. Breathe normally and hold for the target time, squeezing the bar hard the entire set.',
    ['Grab the bar with an overhand grip.', 'Hang with straight arms and active shoulders.', 'Hold for the target time, breathing normally.'],
    ['Improves grip and decompresses the spine.', 'The perfect first step toward pull-ups.'],
    ['Fully relaxing the shoulders for long periods.', 'Swinging.'], ['Lats']);

  /* ======================= TRAPS ======================= */
  X('barbell-shrug', 'Barbell shrug', 'traps', [], ['tp-up'], ['barbell'], 1, 'shrug', 'barbell', '4 × 10-15',
    'Stand tall holding the bar in front of your thighs with straight arms. Lift your shoulders straight up toward your ears as high as possible, hold for a second, then lower slowly to a full stretch. Move straight up and down — no rolling the shoulders — and keep your arms straight.',
    ['Stand with the bar in front of your thighs, arms straight.', 'Raise your shoulders toward your ears as high as possible.', 'Hold 1 second at the top and lower slowly.'],
    ['Vertical movement: do not roll your shoulders.', 'Use straps if your grip fails before your traps.'],
    ['Rolling your shoulders.', 'Bending your elbows.'], ['Forearms']);
  X('dumbbell-shrug', 'Dumbbell shrug', 'traps', [], ['tp-up'], ['dumbbells'], 1, 'shrug', 'dumbbell', '3 × 12-15',
    'Hold the dumbbells at your sides with straight arms. Shrug your shoulders straight up toward your ears, pause at the top, then lower slowly. Keep your chin neutral and your head still — do not jut it forward.',
    ['Dumbbells at your sides.', 'Raise your shoulders toward your ears.', 'Pause at the top and lower under control.'],
    ['Dumbbells allow a more natural path.', 'Keep your chin neutral.'],
    ['Pushing your head forward.', 'Fast bouncing reps.'], ['Forearms']);

  /* ======================= QUADS ======================= */
  X('back-squat', 'Barbell back squat', 'quads', ['glutes'], ['qd-vl', 'qd-vm', 'gl-max'], ['barbell'], 2, 'squat', 'barbell', '4 × 5-8',
    'Rest the bar on your upper traps, feet about shoulder-width apart with toes slightly out. Take a big breath and brace your core before each rep. Sit down and back between your hips, pushing your knees out in line with your toes and keeping your whole foot on the floor. Descend until your thighs are at least parallel, then drive up through your mid-foot, keeping your chest up and back neutral.',
    ['Bar on your upper traps, feet shoulder-width apart, toes slightly out.', 'Take a deep breath and brace your abs.', 'Sit down and back, knees tracking over your toes.', 'Reach at least parallel and drive up by pushing the floor away.'],
    ['The king of leg exercises.', 'Use a rack with safety pins.'],
    ['Knees caving in.', 'Heels lifting.', 'Rounding your back at the bottom.'], ['Glutes', 'Adductors', 'Lower back']);
  X('air-squat', 'Bodyweight squat', 'quads', ['glutes'], ['qd-vl', 'qd-vm', 'gl-max'], ['bodyweight'], 1, 'squat', null, '3 × 15-25',
    'The foundation of every squat. Stand with feet shoulder-width apart, toes slightly out, arms in front or hands at your chest for balance. Push your hips back and down while your knees track over your toes and your heels stay glued to the floor. Go as deep as you can with a neutral back — ideally thighs below parallel — then stand up by pushing the floor away and squeezing your glutes at the top. Inhale down, exhale up.',
    ['Feet shoulder-width apart, toes slightly out.', 'Push your hips back and down, knees over your toes.', 'Go as deep as you can with your heels on the floor and chest up.', 'Stand up by pushing the floor away.'],
    ['Perfect for warming up and for training anywhere.', 'To progress: slow 3-second descents or pauses at the bottom.'],
    ['Heels lifting off the floor.', 'Knees caving in.', 'Rounding your back at the bottom.'], ['Glutes', 'Adductors', 'Core']);
  X('front-squat', 'Front squat', 'quads', [], ['qd-vl', 'qd-vm'], ['barbell'], 3, 'frontSquat', null, '4 × 4-8',
    'Rest the bar on the front of your shoulders, close to your throat, with your elbows high and pointing forward. Keep your torso as upright as possible as you squat deep between your heels. Drive up through your whole foot while lifting your elbows, so the bar never rolls forward.',
    ['Rest the bar on the front of your shoulders, elbows high.', 'Keep your torso very upright.', 'Squat deep while keeping your elbows up.', 'Drive up through your whole foot.'],
    ['More quads and less lower-back stress than the back squat.', 'Requires good wrist and ankle mobility.'],
    ['Dropping your elbows.', 'Leaning forward.'], ['Glutes', 'Core']);
  X('goblet-squat', 'Goblet squat', 'quads', ['glutes'], ['qd-vl', 'qd-vm'], ['kettlebell/dumbbells'], 1, 'gobletSquat', null, '3 × 10-15',
    'Hold a kettlebell or dumbbell tight against your chest with your elbows pointing down. With feet shoulder-width apart, sit down between your legs keeping your chest tall — the weight in front helps you stay upright. Go as deep as you can with a neutral back, then stand up by pushing through your whole foot.',
    ['Hold a kettlebell or dumbbell against your chest.', 'Feet shoulder-width apart.', 'Squat down between your legs with an upright torso.', 'Stand up by pushing the floor away.'],
    ['The best way to learn how to squat.', 'Your elbows can brush the inside of your knees at the bottom.'],
    ['Letting the weight drift away from your chest.', 'Rounding your back.'], ['Glutes', 'Core']);
  X('leg-press', 'Leg press', 'quads', ['glutes'], ['qd-vl', 'qd-vm'], ['machine'], 1, 'legPress', null, '3-4 × 10-15',
    'Sit with your back and hips fully against the pad and your feet hip-width apart in the middle of the platform. Release the safeties and lower the platform by bending your knees toward your chest, stopping before your lower back peels off the pad (around 90°). Press back up through your heels and mid-foot without fully locking your knees.',
    ['Sit with your back flat on the pad, feet hip-width on the platform.', 'Release the safeties and lower the platform by bending your knees.', 'Go down to about 90° without your hips lifting.', 'Press up without fully locking your knees.'],
    ['Feet low = more quads; feet high = more glutes and hamstrings.', 'A great way to load the legs without lower-back stress.'],
    ['Locking your knees at the top.', 'Lifting your lower back by going too deep.'], ['Glutes', 'Adductors']);
  X('hack-squat', 'Hack squat', 'quads', [], ['qd-vl', 'qd-vm'], ['machine'], 2, 'hackSquat', null, '3 × 8-12',
    'Place your back flat against the pad with your shoulders under the pads and feet hip-width apart on the platform. Release the safeties and descend slowly and deep, letting your knees travel forward over your toes. Push back up through your whole foot to just short of lockout, keeping your heels down.',
    ['Back against the pad, shoulders under the pads.', 'Feet hip-width apart on the platform.', 'Lower deep under control.', 'Push up until your legs are almost straight.'],
    ['Guided and stable — ideal for safely hammering the quads.', 'Move your feet forward if your knees bother you.'],
    ['Cutting the range short.', 'Lifting your heels.'], ['Glutes']);
  X('leg-extension', 'Leg extension', 'quads', [], ['qd-rf'], ['machine'], 1, 'legExt', null, '3 × 12-15',
    'Adjust the backrest so your knees line up with the machine\'s pivot point and the roller sits on your lower shins. Hold the handles and keep your hips down. Straighten your legs fully, squeeze your quads for a second at the top, then lower slowly without letting the weight crash.',
    ['Adjust the backrest so your knee lines up with the machine\'s pivot.', 'Roller on your lower shins.', 'Extend your legs to the top and squeeze for 1 second.', 'Lower under control.'],
    ['The only exercise that isolates the rectus femoris.', 'Perfect as a warm-up or finisher.'],
    ['Kicking with momentum.', 'Lifting your hips off the seat.'], []);
  X('bulgarian-split-squat', 'Bulgarian split squat', 'quads', ['glutes'], ['qd-vl', 'gl-max'], ['dumbbells/bodyweight', 'bench'], 2, 'bulgarian', 'dumbbell', '3 × 8-12 per leg',
    'Rest the top of your back foot on a bench and place your front foot far enough forward that your front shin stays fairly vertical at the bottom. Keep most of your weight on the front leg. Lower straight down until your back knee almost touches the floor, then drive up through your front heel. Stay balanced and controlled.',
    ['Rest the top of your back foot on a bench.', 'Place your front foot well forward.', 'Lower straight down until your back knee almost touches the floor.', 'Drive up through your front foot.'],
    ['Upright torso = more quads; leaning forward = more glutes.', 'Brutal for fixing imbalances.'],
    ['Front foot too close to the bench.', 'Losing balance by going too fast.'], ['Glutes', 'Adductors']);
  X('lunge', 'Lunge', 'quads', ['glutes'], ['qd-vl', 'gl-max'], ['dumbbells/bodyweight'], 1, 'lunge', 'dumbbell', '3 × 10-12 per leg',
    'Stand tall with dumbbells at your sides. Take a long step and lower your hips straight down until both knees are bent to about 90°, back knee hovering just above the floor. Keep your torso upright and front knee tracking over your toes, then push through the front heel to return.',
    ['Stand with dumbbells at your sides.', 'Take a long step forward.', 'Lower until both knees are at about 90°.', 'Push through your front leg to return.'],
    ['Can be done walking, backward or stationary.', 'Reverse lunges are kinder to the knees.'],
    ['Front knee caving in.', 'Taking too short a step.'], ['Glutes', 'Adductors']);
  X('step-up', 'Step-up', 'quads', ['glutes'], ['qd-vl', 'gl-max'], ['dumbbells/bodyweight', 'bench'], 1, 'stepUp', 'dumbbell', '3 × 10 per leg',
    'Place your whole foot on a sturdy box or bench. Lean slightly forward and drive through that foot to stand up on the box, without pushing off the bottom leg. Stand fully tall at the top, then lower yourself slowly back down with control.',
    ['Place your whole foot on a box or bench.', 'Push through that leg to step up without bouncing off the bottom foot.', 'Step down under control.'],
    ['Higher box = more glutes.', 'Very functional: powerful stair climbing.'],
    ['Pushing off with the bottom leg.', 'Knee caving in.'], ['Glutes']);

  /* ======================= HAMSTRINGS ======================= */
  X('romanian-deadlift', 'Romanian deadlift', 'hamstrings', ['glutes', 'lowerback'], ['hm-bf', 'hm-semi', 'gl-max'], ['barbell'], 2, 'rdl', 'barbell', '3-4 × 8-10',
    'Start standing with the bar and soft knees. Push your hips back like you are closing a car door with your butt, letting the bar slide down your thighs while your back stays flat. Lower until you feel a strong hamstring stretch — usually just below the knees — then drive your hips forward to stand up. The knees barely move; it is a hinge, not a squat.',
    ['Stand holding the bar, knees slightly bent.', 'Push your hips back, sliding the bar down your legs.', 'Lower until you feel a strong hamstring stretch (just below the knee).', 'Drive your hips forward to stand up.'],
    ['It is a hip hinge, not a squat: the knees barely move.', 'Keep your back neutral at all times.'],
    ['Rounding your back.', 'Bending your knees too much.'], ['Glutes', 'Lower back', 'Forearms']);
  X('dumbbell-rdl', 'Dumbbell Romanian deadlift', 'hamstrings', ['glutes'], ['hm-bf', 'hm-semi'], ['dumbbells'], 1, 'rdl', 'dumbbell', '3 × 10-12',
    'Hold the dumbbells in front of your thighs. Hinge at the hips with a flat back and soft knees, sliding the weights close to your legs until your hamstrings are stretched. Keep your neck in line with your spine, then squeeze your glutes to return to standing.',
    ['Dumbbells in front of your thighs.', 'Push your hips back with a straight back.', 'Lower the dumbbells close to your legs until you feel the stretch.', 'Stand up by squeezing your glutes.'],
    ['Easier to learn than the barbell version.', 'Try it on one leg for more balance and glutes.'],
    ['Looking up (over-extending your neck).', 'Letting the dumbbells drift away from your body.'], ['Glutes', 'Lower back']);
  X('lying-leg-curl', 'Lying leg curl', 'hamstrings', [], ['hm-bf', 'hm-semi'], ['machine'], 1, 'lyingCurl', null, '3 × 10-15',
    'Lie face down with your knees just off the edge of the bench and the roller above your heels. Press your hips into the pad and curl your heels toward your glutes as far as possible. Squeeze, then lower slowly to almost straight legs without letting the weight drop.',
    ['Lie face down with your knees just off the bench.', 'Roller above your ankles.', 'Curl your heels toward your glutes.', 'Lower slowly.'],
    ['Keep your hips pressed into the bench.', 'Toes out or in changes the emphasis.'],
    ['Lifting your hips.', 'Dropping the weight.'], ['Calves']);
  X('seated-leg-curl', 'Seated leg curl', 'hamstrings', [], ['hm-bf', 'hm-semi'], ['machine'], 1, 'seatedCurl', null, '3 × 10-15',
    'Sit with your knees lined up with the machine\'s pivot and lock the thigh pad down firmly. Start with straight legs, then curl the roller down and under the seat as far as you can. Return slowly until your legs are straight again. Leaning your torso slightly forward increases the hamstring stretch.',
    ['Sit with your knee lined up with the machine\'s pivot.', 'Lower the thigh pad onto your legs.', 'Bend your knees, bringing the roller under the seat.', 'Return under control.'],
    ['Seated puts the hamstrings on more stretch — great stimulus.', 'Lean slightly forward.'],
    ['Using momentum.', 'Short range of motion.'], ['Calves']);
  X('nordic-curl', 'Nordic hamstring curl', 'hamstrings', [], ['hm-bf', 'hm-semi'], ['bodyweight'], 3, 'nordic', null, '3 × 3-6',
    'Kneel with your ankles anchored under something solid. Keep your body in one straight line from knees to head — hips must not bend. Lower yourself toward the floor as slowly as you can, fighting the fall with your hamstrings. Catch yourself with your hands at the bottom and push back to the start.',
    ['Kneel with your ankles secured.', 'Body straight from knees to head.', 'Fall forward as slowly as possible, braking with your hamstrings.', 'Catch yourself with your hands and return.'],
    ['One of the best exercises for preventing hamstring injuries.', 'Start with the lowering phase only.'],
    ['Bending at the hips.', 'Falling without braking.'], ['Glutes', 'Calves']);
  X('good-morning', 'Good morning', 'hamstrings', ['lowerback'], ['hm-bf', 'lb-ere'], ['barbell'], 2, 'goodMorning', 'barbell', '3 × 8-10',
    'Place the bar on your upper back as for a squat, knees slightly bent. Push your hips back and hinge your torso forward with a completely flat back until you feel your hamstrings stretch, then drive your hips forward to stand up. Use light weight — this movement is demanding on the lower back.',
    ['Bar on your upper traps as in a squat.', 'Knees slightly bent.', 'Hinge your torso forward by pushing your hips back, back straight.', 'Return to standing.'],
    ['Start very light: it is demanding on the lower back.', 'Strengthens the entire posterior chain.'],
    ['Rounding your back.', 'Going too low without the mobility.'], ['Glutes', 'Lower back']);

  /* ======================= GLUTES ======================= */
  X('hip-thrust', 'Hip thrust', 'glutes', [], ['gl-max'], ['barbell', 'bench'], 2, 'hipThrust', 'barbell', '4 × 8-12',
    'Rest your upper back (just below the shoulder blades) on a bench with a padded bar over your hips. Place your feet hip-width apart so your shins are vertical at the top. Tuck your chin, brace, and drive through your heels to lift your hips until your body forms a straight line from shoulders to knees. Squeeze your glutes hard at the top, keep your ribs down, and lower under control.',
    ['Rest your upper back on a bench, bar over your hips (with a pad).', 'Feet hip-width apart, knees at 90° at the top.', 'Drive your hips up while squeezing your glutes.', 'Pause at the top with your chin tucked and lower under control.'],
    ['The best exercise for the gluteus maximus.', 'Look forward, not at the ceiling.'],
    ['Arching your back instead of extending your hips.', 'Feet too far away (shifts to the hamstrings).'], ['Hamstrings']);
  X('glute-bridge', 'Glute bridge', 'glutes', [], ['gl-max'], ['bodyweight'], 1, 'gluteBridge', null, '3 × 15-20',
    'Lie on your back with your knees bent and feet flat, hip-width apart. Flatten your lower back slightly, then push through your heels to lift your hips until your body is straight from shoulders to knees. Squeeze your glutes for two seconds at the top and lower slowly.',
    ['Lie on your back, knees bent, feet flat on the floor.', 'Push through your heels and lift your hips.', 'Squeeze your glutes for 2 seconds at the top.', 'Lower slowly.'],
    ['Perfect for activating the glutes before leg training.', 'Do it on one leg to progress.'],
    ['Pushing through your toes.', 'Arching your lower back.'], ['Hamstrings', 'Core']);
  X('cable-glute-kickback', 'Cable glute kickback', 'glutes', [], ['gl-max'], ['cable'], 1, 'cableKickback', null, '3 × 12-15 per leg',
    'Attach an ankle strap to a low pulley and hold the machine for support with a slight forward lean. Keeping your core tight and pelvis square, drive your working leg back by extending the hip and squeezing your glute. Stop before your lower back arches, then return slowly.',
    ['Ankle strap on a low pulley. Hold the machine.', 'Lean your torso slightly.', 'Drive your leg back by extending your hip.', 'Return under control.'],
    ['Squeeze your glute; do not arch your back.', 'A good isolation exercise.'],
    ['Swinging your leg.', 'Rotating your hips.'], ['Hamstrings']);
  X('hip-abduction-machine', 'Hip abduction machine', 'glutes', ['adductors'], ['gl-med', 'ad-abd'], ['machine'], 1, 'abductor', null, '3 × 15-20',
    'Sit with the pads on the outside of your knees and your back against the seat. Push your knees out as far as you can, pause for a second, then let them come back together slowly without letting the stack slam. Leaning slightly forward puts more emphasis on the glutes.',
    ['Sit with the pads on the outside of your knees.', 'Push your legs outward.', 'Pause and return slowly.'],
    ['Leaning forward emphasizes the glutes more.', 'Helps stabilize knees and pelvis.'],
    ['Letting the legs snap closed.', 'Using momentum from your torso.'], []);
  X('sumo-squat', 'Sumo squat', 'glutes', ['adductors'], ['gl-max', 'ad-add'], ['kettlebell/dumbbells'], 1, 'sumoSquat', null, '3 × 10-12',
    'Take a wide stance with your toes turned out about 30-45°. Hold a kettlebell or dumbbell between your legs with straight arms. Sit straight down with your torso upright, actively pushing your knees out in line with your toes, then stand up by squeezing your glutes and inner thighs.',
    ['Take a wide stance with your toes turned out.', 'Hold a kettlebell or dumbbell between your legs.', 'Squat down with an upright torso, knees out.', 'Stand up by squeezing your glutes.'],
    ['Lots of adductor and glute work.', 'Stand on two platforms for more depth.'],
    ['Knees caving in.', 'Leaning forward.'], ['Quads', 'Adductors']);

  /* ======================= CALVES ======================= */
  X('standing-calf-raise', 'Standing calf raise', 'calves', [], ['cf-gas'], ['dumbbells/bodyweight'], 1, 'calfRaise', 'dumbbell', '4 × 12-20',
    'Stand with the balls of your feet on a step and knees straight but not locked. Lower your heels as far as possible for a deep stretch and pause for a second. Rise onto your toes as high as you can, hold the top for a second, then lower slowly. No bouncing — the pause at the bottom is what makes it work.',
    ['Stand (ideally with the balls of your feet on a step) holding weight.', 'Raise your heels as high as possible.', 'Pause 1 second at the top.', 'Lower to a full stretch.'],
    ['Full range and a pause at the bottom: no bouncing.', 'Calves can handle a lot of volume.'],
    ['Bouncing.', 'Bending your knees.'], []);
  X('machine-calf-raise', 'Standing calf raise machine', 'calves', [], ['cf-gas'], ['machine'], 1, 'calfMachine', null, '4 × 10-15',
    'Get under the shoulder pads with the balls of your feet on the edge of the platform and your knees almost straight. Lower your heels below the platform for a full stretch, then drive up onto your toes as high as possible. Control every rep — slow down, pause up.',
    ['Shoulders under the pads, balls of your feet on the platform edge.', 'Knees almost straight.', 'Raise your heels as high as possible.', 'Lower slowly to a stretch.'],
    ['You can load heavy weight safely.', 'Try long sets of 20-30 reps.'],
    ['Short range of motion.', 'Bending your knees to help.'], []);
  X('seated-calf-raise', 'Seated calf raise', 'calves', [], ['cf-sol'], ['machine'], 1, 'seatedCalf', null, '3 × 15-20',
    'Sit with the pad resting on your lower thighs just above the knees and the balls of your feet on the platform. Release the safety, lower your heels to a full stretch, then press up onto your toes as high as you can. With bent knees, this targets the soleus.',
    ['Sit with the pad on your thighs near the knees.', 'Balls of your feet on the platform.', 'Raise your heels and lower slowly.'],
    ['With bent knees you mostly work the soleus.', 'Pair it with standing calf raises.'],
    ['Using momentum.', 'Not going all the way down.'], []);

  /* ======================= ADDUCTORS ======================= */
  X('hip-adduction-machine', 'Hip adduction machine', 'adductors', [], ['ad-add'], ['machine'], 1, 'adductor', null, '3 × 12-15',
    'Sit with the pads against the inside of your knees and start from a comfortable, not maximal, opening. Squeeze your legs together until the pads meet, pause, then open slowly back to the start. Control the opening phase — that is where groin strains happen.',
    ['Sit with the pads on the inside of your knees.', 'Squeeze your legs together.', 'Open slowly to a comfortable stretch.'],
    ['Helps prevent groin injuries.', 'Control the opening phase carefully.'],
    ['Opening too fast.', 'Starting with too wide an opening.'], []);
  X('copenhagen-plank', 'Copenhagen plank', 'adductors', ['obliques'], ['ad-add', 'ob-lat'], ['bench'], 3, 'sidePlank', null, '3 × 15-30 s per side',
    'Lie on your side with your forearm under your shoulder and your top leg resting on a bench (knee for the easier version, ankle for the harder one). Press the top leg into the bench and lift your hips until your body forms a straight line. Hold without letting your hips sag or rotate.',
    ['Lie on your side with your forearm on the floor.', 'Rest your top leg on a bench (knee or ankle).', 'Lift your hips until your body is straight.', 'Hold for the target time.'],
    ['Resting the knee is easier than the ankle.', 'A great injury-prevention exercise for sports.'],
    ['Letting your hips drop.', 'Rotating your torso.'], ['Obliques']);

  /* ======================= ABS ======================= */
  X('crunch', 'Crunch', 'abs', [], ['ab-up'], ['bodyweight'], 1, 'crunch', null, '3 × 15-20',
    'Lie on your back with knees bent and hands lightly beside your head. Curl your trunk by bringing your ribs toward your pelvis, lifting only your shoulder blades off the floor. Exhale as you crunch, pause for a second, then lower slowly. Your hands support your head — they never pull on your neck.',
    ['Lie on your back with your knees bent.', 'Hands beside your head without pulling your neck.', 'Curl your trunk, lifting your shoulders off the floor.', 'Lower slowly.'],
    ['Think about bringing your ribs toward your pelvis.', 'Exhale as you come up.'],
    ['Pulling on your neck with your hands.', 'Using momentum to come up.'], []);
  X('cable-crunch', 'Cable crunch', 'abs', [], ['ab-up'], ['cable'], 2, 'cableCrunch', null, '3 × 12-15',
    'Kneel facing a high pulley with the rope held beside your head. Keep your hips fixed — they should not sit back. Crunch by rounding your spine and bringing your elbows toward your thighs, exhaling hard, then return slowly until your abs are stretched.',
    ['Kneel facing the high pulley, rope beside your head.', 'Keep your hips still.', 'Round your trunk, bringing your elbows toward your thighs.', 'Return under control.'],
    ['Lets you load your abs progressively.', 'Move your spine, not your hips.'],
    ['Sitting back on your heels and moving your hips.', 'Pulling with your arms.'], []);
  X('hanging-leg-raise', 'Hanging leg raise', 'abs', [], ['ab-low'], ['pullupbar'], 3, 'hangingRaise', null, '3 × 8-12',
    'Hang from the bar with straight arms and active shoulders. Without swinging, raise your straight legs to at least horizontal by curling your pelvis up at the end, not just lifting with your hip flexors. Lower slowly and stop any swing before the next rep.',
    ['Hang from the bar with straight arms.', 'Raise your straight legs to horizontal or higher.', 'Lower under control without swinging.'],
    ['Tilt your pelvis up at the top for more abs.', 'Too hard? Start with knees to chest.'],
    ['Swinging.', 'Lifting only with your hip flexors.'], ['Hip flexors', 'Forearms']);
  X('hanging-knee-raise', 'Hanging knee raise', 'abs', [], ['ab-low'], ['pullupbar'], 2, 'kneeRaise', null, '3 × 10-15',
    'Hang from the bar with straight arms. Bring your knees up toward your chest while curling your pelvis upward, so the lower abs do the work. Lower slowly with control and avoid swinging between reps.',
    ['Hang from the bar.', 'Bring your knees to your chest while curling your pelvis.', 'Lower slowly.'],
    ['Easier version of the leg raise.', 'Can also be done in a captain\'s chair.'],
    ['Swinging.', 'Dropping your legs.'], ['Hip flexors']);
  X('lying-leg-raise', 'Lying leg raise', 'abs', [], ['ab-low'], ['bodyweight'], 1, 'legRaise', null, '3 × 12-15',
    'Lie on your back with your arms by your sides and press your lower back into the floor. Raise your straight legs to vertical, then lower them slowly, stopping before your lower back starts to lift. If it lifts, bend your knees or shorten the range.',
    ['Lie on your back with your hands at your sides.', 'Raise your straight legs to vertical.', 'Lower slowly without your lower back lifting off the floor.'],
    ['If your lower back lifts, bend your knees.', 'Hands under your glutes for more stability.'],
    ['Arching your back.', 'Dropping your legs.'], ['Hip flexors']);
  X('plank', 'Plank', 'abs', [], ['ab-tva'], ['bodyweight'], 1, 'plank', null, '3 × 30-60 s',
    'Place your forearms on the floor with your elbows directly under your shoulders. Form a straight line from head to heels, squeeze your glutes, tuck your pelvis slightly and brace your abs as if about to be punched. Push the floor away with your forearms and breathe steadily — never hold your breath.',
    ['Forearms on the floor, elbows under your shoulders.', 'Body straight from head to heels.', 'Squeeze your glutes and abs.', 'Breathe and hold.'],
    ['30 perfect seconds beat 2 sloppy minutes.', 'Push the floor away with your forearms.'],
    ['Hips sagging or too high.', 'Holding your breath.'], ['Shoulders', 'Glutes']);
  X('ab-wheel-rollout', 'Ab wheel rollout', 'abs', [], ['ab-tva', 'ab-up'], ['abwheel'], 3, 'abWheel', null, '3 × 6-12',
    'Kneel with the wheel under your shoulders and your abs braced, pelvis slightly tucked. Roll forward slowly, extending your body while keeping your lower back from arching. Go only as far as you can control, then pull the wheel back with your abs, not your hips.',
    ['Kneel with the wheel under your shoulders.', 'Roll forward, extending your body with your abs tight.', 'Go as far as you can without arching your back.', 'Pull back using your abs.'],
    ['One of the hardest core exercises.', 'Start with a short range or roll toward a wall.'],
    ['Arching your lower back.', 'Going too far too soon.'], ['Lats', 'Shoulders']);

  /* ======================= OBLIQUES ======================= */
  X('russian-twist', 'Russian twist', 'obliques', [], ['ob-rot'], ['plate/bodyweight'], 1, 'russianTwist', null, '3 × 20 (10 per side)',
    'Sit with your knees bent and lean back with a long, straight spine — do not round your back. Hold a plate in front of your chest and rotate your whole torso from side to side, following the plate with your eyes. Lift your feet for a harder version.',
    ['Sit, lean your torso back and lift your feet if you can.', 'Hold a plate in front of your chest.', 'Rotate your trunk from side to side.'],
    ['Rotate with your torso, not just your arms.', 'Keep your feet on the floor to make it easier.'],
    ['Rounding your back.', 'Moving only your arms.'], ['Abs']);
  X('side-plank', 'Side plank', 'obliques', [], ['ob-lat'], ['bodyweight'], 1, 'sidePlank', null, '3 × 20-45 s per side',
    'Lie on your side with your forearm directly under your shoulder and legs stacked. Lift your hips so your body forms a straight line from head to feet, pushing the floor away with your forearm. Hold without letting your hips drop or your chest roll toward the floor.',
    ['Lie on your side with your forearm under your shoulder.', 'Lift your hips into a straight line.', 'Hold without letting your hips drop.'],
    ['Add hip dips to make it dynamic.', 'Rest on your knees if it is too hard.'],
    ['Hips sagging.', 'Rotating your body toward the floor.'], ['Glute medius', 'Shoulders']);
  X('cable-woodchopper', 'Cable woodchopper', 'obliques', [], ['ob-rot'], ['cable'], 2, 'woodchop', null, '3 × 12 per side',
    'Set a pulley high and grab the handle with both hands, arms long. Pull diagonally down across your body toward the opposite hip by rotating your torso, pivoting your back foot as you turn. Your arms just guide the cable — the power comes from your trunk. Return slowly along the same path.',
    ['High pulley, grab the handle with both hands.', 'Pull diagonally toward the opposite hip while rotating your trunk.', 'Pivot your back foot.', 'Return under control.'],
    ['Also works low to high.', 'Transfers well to sports with rotation.'],
    ['Pulling only with your arms.', 'Rounding your back.'], ['Shoulders', 'Abs']);
  X('pallof-press', 'Pallof press', 'obliques', ['abs'], ['ob-rot', 'ab-tva'], ['cable'], 1, 'pallof', null, '3 × 10-12 per side',
    'Stand side-on to a cable set at chest height, feet shoulder-width and knees soft. Hold the handle at your sternum, then press it straight out in front of you while resisting the cable\'s pull to rotate you. Hold for two seconds with arms straight, then bring it back to your chest. Your torso should not move at all.',
    ['Stand side-on to the cable with the handle at your chest.', 'Press your arms straight out, resisting the twist.', 'Hold 2 seconds and bring it back to your chest.'],
    ['Anti-rotation: one of the best exercises for protecting your back.', 'The farther from the cable, the harder.'],
    ['Letting your torso rotate.', 'Arching your back.'], ['Abs', 'Glutes']);
  X('dumbbell-side-bend', 'Dumbbell side bend', 'obliques', [], ['ob-lat'], ['dumbbells'], 1, 'sideBend', null, '3 × 12-15 per side',
    'Stand tall holding one dumbbell at your side. Bend sideways toward the dumbbell, moving only in the side plane — no leaning forward or twisting. Then pull yourself back up using the obliques on the opposite side. Only use one dumbbell, otherwise the weights cancel each other out.',
    ['Stand holding a dumbbell in one hand.', 'Bend your trunk toward the dumbbell side.', 'Come back up by contracting the opposite oblique.'],
    ['Only one dumbbell: with two they cancel out.', 'Slow, controlled movement.'],
    ['Twisting your torso.', 'Leaning forward.'], ['Lower back']);

  /* ======================= LOWER BACK ======================= */
  X('back-extension', 'Back extension (hyperextension)', 'lowerback', ['glutes', 'hamstrings'], ['lb-ere', 'gl-max'], ['machine'], 1, 'hyperext', null, '3 × 12-15',
    'Set the 45° bench so the pad sits just below your hip crease, letting you hinge freely. Cross your arms over your chest and lower your torso with a neutral spine. Rise until your body forms a straight line with your legs — not beyond. Move slowly and squeeze your glutes at the top.',
    ['Position yourself on the 45° bench with the pad just below your hips.', 'Cross your arms over your chest.', 'Lower your torso with a straight back.', 'Rise until your body is straight — no further.'],
    ['Hold a plate to your chest to progress.', 'Rounding your upper back slightly puts more emphasis on the glutes.'],
    ['Going past a straight line (hyperextending).', 'Fast, bouncing reps.'], ['Glutes', 'Hamstrings']);
  X('bird-dog', 'Bird dog', 'lowerback', ['abs'], ['lb-stab', 'ab-tva'], ['bodyweight'], 1, 'birdDog', null, '3 × 10 per side',
    'Start on all fours with hands under your shoulders and knees under your hips, spine neutral. Slowly extend one arm forward and the opposite leg back until both are level with your torso. Hold for two seconds without letting your hips rotate or your back sag, then return and switch sides.',
    ['On all fours: hands under shoulders, knees under hips.', 'Extend one arm forward and the opposite leg back.', 'Hold 2 seconds without moving your hips.', 'Return and switch sides.'],
    ['Imagine balancing a glass of water on your back.', 'Ideal warm-up before deadlifts.'],
    ['Rotating your hips.', 'Arching your back.'], ['Glutes', 'Shoulders']);

  window.GR_DATA = { EQUIP, CATS, MUSCLES, EX };
})();
