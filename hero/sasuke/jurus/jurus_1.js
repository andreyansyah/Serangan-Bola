function executeSkill1(hero, ctx, callback) {
  const skillFrames = [];
  for (let i = 1; i <= 11; i++) {
    const img = new Image();
    img.src = '../hero/naruto/jurus/jurus_1/jurus_' + i + '.png';
    skillFrames.push(img);
  }

  const rasenganImg = new Image();
  rasenganImg.src = '../hero/naruto/jurus/jurus_1/rasengan_1.png';

  const rasenganSound = new Audio('../hero/naruto/jurus/jurus_1/rasengan_1.mp3');
  let soundPlayed = false;

  // Kunci movement sementara
  hero.lockMove = true;
  setTimeout(() => {
    hero.lockMove = false;
  }, 2000);

  let index = 0;
  const totalFrames = skillFrames.length;
  const frameDelay = 6;
  let frameCounter = 0;

  const rasengan = {
    x: hero.x + hero.width / 2,
    y: hero.y + 30,
    angle: 0,
    phase: 'spin',
    frameShoot: 0,
    dropCounter: 0,
    lingerCounter: 0
  };

  function animateSkill() {
    frameCounter++;
    if (frameCounter >= frameDelay) {
      frameCounter = 0;
      index++;
    }

    if (index === 0 && !soundPlayed) {
      rasenganSound.play();
      soundPlayed = true;
    }

    if (index >= totalFrames && rasengan.phase === 'done') {
      callback();
      return;
    }

    // 🔄 Redraw semua objek seperti di gameLoop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // ✅ Gambar gawang (agar tidak hilang saat skill)
    drawGoalpost2Left();
    drawGoalpost2();
    ctx.save();
    ctx.translate(ball.x + ball.radius, ball.y + ball.radius);
    ctx.rotate(ball.rotation);
    ctx.drawImage(ballImg, -ball.radius, -ball.radius, ball.radius * 2, ball.radius * 2);
    ctx.restore();


    // Gambar Naruto (frame jurus)
    const frame = skillFrames[Math.min(index, totalFrames - 1)];
    if (hero.direction === 'left') {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(frame, -hero.x - hero.width, hero.y, hero.width, hero.height);
      ctx.restore();
    } else {
      ctx.drawImage(frame, hero.x, hero.y, hero.width, hero.height);
    }

    // Transisi fase rasengan
    if (index <= 5) {
      rasengan.phase = 'spin';
    } else if (index === 6) {
      rasengan.phase = 'rise';
    } else if (index === 7) {
      rasengan.phase = 'drop';
    } else if (index >= 8 && rasengan.phase === 'drop') {
      rasengan.phase = 'shoot';
    }

    // Gerak rasengan
    if (rasengan.phase === 'spin') {
      rasengan.x = hero.direction === 'right' ? hero.x + 20 : hero.x + hero.width - 20;
      rasengan.y = hero.y + 40;
      rasengan.angle -= 0.5;
    } else if (rasengan.phase === 'rise') {
      rasengan.x = hero.x + hero.width / 2;
      rasengan.y -= 6;
      rasengan.angle -= 0.5;
    } else if (rasengan.phase === 'drop') {
      rasengan.y += 5;
      rasengan.angle -= 0.5;
      rasengan.dropCounter++;
      if (rasengan.dropCounter > 4) {
        rasengan.phase = 'shoot';
      }
    } else if (rasengan.phase === 'shoot') {
      const speed = 4;
      if (hero.direction === 'right') rasengan.x += speed;
      else rasengan.x -= speed;

      rasengan.angle -= 0.5;
      rasengan.frameShoot++;
      if (rasengan.frameShoot > 15) {
        rasengan.phase = 'linger';
        rasengan.x -= hero.direction === 'right' ? 20 : -20;
      }
    } else if (rasengan.phase === 'linger') {
      rasengan.angle -= 0.5;
      rasengan.lingerCounter++;
      if (rasengan.lingerCounter > 40) {
        rasengan.phase = 'done';
      }
    }

    // Gambar rasengan (efek)
    if (rasengan.phase !== 'done') {
      ctx.save();
      ctx.translate(rasengan.x, rasengan.y);
      ctx.rotate(rasengan.angle);
      ctx.drawImage(rasenganImg, -15, -15, 30, 30);
      ctx.restore();
    }

    requestAnimationFrame(animateSkill);


    drawGoalpostLeft();
    drawGoalpost();
    drawScoreboard();
  }

  requestAnimationFrame(animateSkill);
}
