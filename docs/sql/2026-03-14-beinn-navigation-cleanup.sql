BEGIN TRANSACTION;

-- 1. Apaga secciones activas que ya no tienen módulos activos visibles.
UPDATE s
SET s.Activo = 0
FROM Secciones s
WHERE s.Activo = 1
  AND NOT EXISTS (
      SELECT 1
      FROM Modulos m
      WHERE m.SeccionId = s.Id
        AND m.Activo = 1
  );

-- 2. Apaga módulos activos que todavía cuelgan de secciones ya inactivas.
UPDATE m
SET m.Activo = 0
FROM Modulos m
INNER JOIN Secciones s ON s.Id = m.SeccionId
WHERE m.Activo = 1
  AND s.Activo = 0;

-- 3. Apaga vistas activas que pudieran quedar bajo módulos inactivos.
UPDATE v
SET v.Activo = 0
FROM Vistas v
INNER JOIN Modulos m ON m.Id = v.ModuloId
WHERE v.Activo = 1
  AND m.Activo = 0;

COMMIT TRANSACTION;
