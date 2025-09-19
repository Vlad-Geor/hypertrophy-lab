import { Knex } from 'knex';

export async function up(knex: Knex) {
  // orders
  await knex.schema.withSchema('nutrition').createTable('orders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE');
    t.text('supplier_name').nullable();
    t.text('status').notNullable();
    t.date('order_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'));
    t.text('tracking_number').nullable();
    t.text('tracking_url').nullable();
    t.integer('total_cost_cents').nullable();
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['user_id', 'created_at'], 'orders_user_created_idx');
  });

  await knex.raw(`
    ALTER TABLE nutrition.orders
      ADD CONSTRAINT orders_status_chk CHECK (status IN ('ordered','in_transit','arrived','out_for_delivery','delivered','canceled')),
      ADD CONSTRAINT orders_total_cost_chk CHECK (total_cost_cents IS NULL OR total_cost_cents >= 0);
  `);

  // order_items
  await knex.schema.withSchema('nutrition').createTable('order_items', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('order_id')
      .notNullable()
      .references('id')
      .inTable('nutrition.orders')
      .onDelete('CASCADE');
    t.uuid('catalog_id')
      .nullable()
      .references('id')
      .inTable('nutrition.supplement_catalog')
      .onDelete('SET NULL');
    t.text('name').notNullable(); // denormalized label
    t.integer('quantity_units').notNullable();
    t.integer('cost_cents').nullable();
    t.index(['order_id']);
  });

  await knex.raw(`
    ALTER TABLE nutrition.order_items
      ADD CONSTRAINT order_items_qty_chk CHECK (quantity_units >= 0),
      ADD CONSTRAINT order_items_cost_chk CHECK (cost_cents IS NULL OR cost_cents >= 0);
  `);
}

export async function down(knex: Knex) {
  await knex.schema.withSchema('nutrition').dropTableIfExists('order_items');
  await knex.schema.withSchema('nutrition').dropTableIfExists('orders');
}
