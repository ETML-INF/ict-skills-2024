SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `cart`
(
    `id`     varchar(50) NOT NULL,
    `status` varchar(50) NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `cart_item`
(
    `id`         int(11)                                                      NOT NULL,
    `cart_id`    varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `product_id` int(11)                                                      NOT NULL,
    `quantity`   int(11)                                                      NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `discount`
(
    `id`                  int(11)                            NOT NULL,
    `product_id`          int(11)                            NOT NULL,
    `min_purchase_amount` int(11)                            NOT NULL,
    `type`                enum ('fixed_amount','percentage') NOT NULL,
    `value`               decimal(10, 2)                     NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

INSERT INTO `discount` (`id`, `product_id`, `min_purchase_amount`, `type`, `value`)
VALUES (1, 1, 3, 'fixed_amount', 20.00),
       (2, 2, 5, 'percentage', 10.00);

CREATE TABLE `product`
(
    `id`    int(11)        NOT NULL,
    `price` decimal(10, 2) NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

INSERT INTO `product` (`id`, `price`)
VALUES (1, 40.00),
       (2, 10.00);


ALTER TABLE `cart`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `cart_item`
    ADD PRIMARY KEY (`id`),
    ADD KEY `product_id_ix` (`product_id`),
    ADD KEY `cart_id_ix` (`cart_id`);

ALTER TABLE `discount`
    ADD PRIMARY KEY (`id`),
    ADD KEY `product_id_ix` (`product_id`);

ALTER TABLE `product`
    ADD PRIMARY KEY (`id`);


ALTER TABLE `cart_item`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `discount`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 3;


ALTER TABLE `cart_item`
    ADD CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
    ADD CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `discount`
    ADD CONSTRAINT `discount_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);
